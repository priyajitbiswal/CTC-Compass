"""
CTC Compass India — FastAPI Web Server
"""

import json
import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

from engine.calculator import deconstruct_ctc, calculate_new_regime_tax_2026, calculate_old_regime_tax
from engine.comparator import compare_two_offers
from engine.government import calculate_government_salary, compare_tech_vs_sarkari, PAY_MATRIX_LEVELS

# Load unified dataset at startup
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "ctc_compass_unified.json")
with open(DATA_FILE, "r", encoding="utf-8") as f:
    UNIFIED_DATA = json.load(f)

app = FastAPI(
    title="CTC Compass India",
    description="Verified Indian Salary Structures, Taxation, and Government Compensation Engine",
    version="2.0.0"
)

# Mount static files
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# Pydantic Request Models
class CalculateRequest(BaseModel):
    annual_ctc: float = Field(..., ge=0, description="Headline Annual CTC in INR")
    basic_pct: float = Field(40.0, ge=10.0, le=70.0, description="Basic salary as % of CTC")
    variable_pct: float = Field(10.0, ge=0.0, le=60.0, description="Variable pay as % of CTC")
    joining_bonus: float = Field(0.0, ge=0.0, description="One-time 1st year joining bonus")
    retention_bonus: float = Field(0.0, ge=0.0, description="Annual retention bonus")
    annual_equity: float = Field(0.0, ge=0.0, description="Annual vesting stock / ESOP value")
    cap_epf_at_statutory_ceiling: bool = Field(True, description="Cap EPF at ₹15,000 monthly wage ceiling (₹1,800/mo)")
    include_gratuity: bool = Field(True, description="Whether gratuity is deducted from headline CTC")
    include_insurance: bool = Field(True, description="Whether health insurance is deducted from CTC")
    annual_insurance_cost: float = Field(25000.0, ge=0.0)
    annual_professional_tax: float = Field(2400.0, ge=0.0)
    tax_regime: str = Field("new", description="'new' or 'old'")
    deductions_80c: float = Field(150000.0, ge=0.0)
    deductions_80d: float = Field(25000.0, ge=0.0)
    hra_exemption: float = Field(0.0, ge=0.0)


class OfferCompareRequest(BaseModel):
    offer_a: Dict[str, Any]
    offer_b: Dict[str, Any]


class GovtCompareRequest(BaseModel):
    tech_ctc: float = Field(..., ge=0)
    govt_post_name: str = Field("Assistant Section Officer / Inspector of Income Tax")
    govt_pay_level: str = Field("Level 7")
    city_tier: str = Field("X")
    da_rate_pct: float = Field(50.0, ge=0.0, le=100.0)


@app.get("/")
def serve_index():
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "CTC Compass India API is online. Build the static frontend to view the UI."}


@app.get("/api/metadata")
def get_metadata():
    """Returns dataset summary statistics and tax engine configuration."""
    return {
        "metadata": UNIFIED_DATA.get("metadata", {}),
        "tax_engine": UNIFIED_DATA.get("tax_and_payroll_engine", {}),
        "government_pay_levels": list(PAY_MATRIX_LEVELS.keys()),
        "total_companies": len(UNIFIED_DATA.get("companies", [])),
        "total_sources": len(UNIFIED_DATA.get("sources_register", []))
    }


@app.get("/api/companies")
def search_companies(
    q: Optional[str] = Query(None, description="Search company name or industry"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    min_ctc: Optional[float] = Query(None, description="Filter min CTC in INR"),
    max_ctc: Optional[float] = Query(None, description="Filter max CTC in INR"),
    has_breakdown: Optional[bool] = Query(None, description="Only companies with granular breakdowns")
):
    """Search and filter the 150 companies in the database."""
    results = []
    q_lower = q.lower().strip() if q else None
    ind_lower = industry.lower().strip() if industry else None

    for comp in UNIFIED_DATA.get("companies", []):
        name_match = (
            q_lower is None or
            q_lower in comp["company_name"].lower() or
            q_lower in comp["canonical_name"].lower() or
            q_lower in comp.get("industry_category", "").lower()
        )
        if not name_match:
            continue

        if ind_lower and ind_lower not in comp.get("industry_category", "").lower():
            continue

        # Check breakdown presence if requested
        observations = comp.get("compensation_observations", [])
        if has_breakdown:
            has_b = any(
                o.get("breakdown_inr", {}).get("base_salary") or
                o.get("breakdown_inr", {}).get("variable_pay")
                for o in observations
            )
            if not has_b:
                continue

        # Check CTC ranges
        if min_ctc or max_ctc:
            matches_ctc = False
            for o in observations:
                ctc_min = o.get("annual_ctc", {}).get("min_inr") or 0
                ctc_max = o.get("annual_ctc", {}).get("max_inr") or ctc_min
                if min_ctc and ctc_max < min_ctc:
                    continue
                if max_ctc and ctc_min > max_ctc:
                    continue
                matches_ctc = True
                break
            if not matches_ctc and observations:
                continue

        results.append(comp)

    return {
        "count": len(results),
        "companies": results
    }


@app.get("/api/companies/{company_id}")
def get_company_details(company_id: str):
    """Retrieve full details, observations, campus reports, and sources for a single company."""
    for comp in UNIFIED_DATA.get("companies", []):
        if comp["company_id"].upper() == company_id.upper():
            return comp
    raise HTTPException(status_code=404, detail="Company not found")


@app.get("/api/government/posts")
def get_government_posts():
    """Retrieve the deduplicated central civil service posts and pay rules."""
    return {
        "posts": UNIFIED_DATA.get("government", {}).get("posts", []),
        "pay_rules": UNIFIED_DATA.get("government", {}).get("pay_rules", []),
        "pay_matrix_levels": PAY_MATRIX_LEVELS
    }


@app.post("/api/calculate")
def calculate_take_home(req: CalculateRequest):
    """Deconstructs headline CTC into monthly in-hand and tax components."""
    old_deductions = {
        "80c": req.deductions_80c,
        "80d": req.deductions_80d,
        "hra": req.hra_exemption
    } if req.tax_regime == "old" else None

    result = deconstruct_ctc(
        annual_ctc=req.annual_ctc,
        basic_pct=req.basic_pct,
        variable_pct=req.variable_pct,
        joining_bonus=req.joining_bonus,
        retention_bonus=req.retention_bonus,
        annual_equity=req.annual_equity,
        cap_epf_at_statutory_ceiling=req.cap_epf_at_statutory_ceiling,
        include_gratuity_in_ctc=req.include_gratuity,
        include_insurance_in_ctc=req.include_insurance,
        annual_insurance_cost=req.annual_insurance_cost,
        annual_professional_tax=req.annual_professional_tax,
        tax_regime=req.tax_regime,
        old_regime_deductions=old_deductions
    )
    return result


@app.post("/api/compare")
def compare_offers(req: OfferCompareRequest):
    """Compares two private tech offers side-by-side."""
    return compare_two_offers(req.offer_a, req.offer_b)


@app.post("/api/govt-compare")
def compare_tech_government(req: GovtCompareRequest):
    """Compares a private tech offer against a Central Government post."""
    return compare_tech_vs_sarkari(
        tech_ctc=req.tech_ctc,
        govt_post_name=req.govt_post_name,
        govt_pay_level=req.govt_pay_level,
        city_tier=req.city_tier,
        da_rate_pct=req.da_rate_pct
    )
