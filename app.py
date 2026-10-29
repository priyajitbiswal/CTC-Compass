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
from engine.government import calculate_public_sector_pay, compare_private_vs_public

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "ctc_compass_unified.json")

def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

UNIFIED_DATA = load_data()

app = FastAPI(
    title="CTC Compass India",
    description="Verified Indian Salary Structures, Taxation, and Government Compensation Engine",
    version="3.0.0"
)

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class CalculateRequest(BaseModel):
    annual_ctc: float = Field(..., ge=0, description="Headline Annual CTC in INR")
    basic_pct: float = Field(40.0, ge=10.0, le=70.0)
    variable_pct: float = Field(10.0, ge=0.0, le=60.0)
    joining_bonus: float = Field(0.0, ge=0.0)
    retention_bonus: float = Field(0.0, ge=0.0)
    annual_equity: float = Field(0.0, ge=0.0)
    cap_epf_at_statutory_ceiling: bool = Field(True)
    include_gratuity: bool = Field(True)
    include_insurance: bool = Field(True)
    annual_insurance_cost: float = Field(25000.0, ge=0.0)
    annual_professional_tax: float = Field(2400.0, ge=0.0)
    tax_regime: str = Field("new")
    deductions_80c: float = Field(150000.0, ge=0.0)
    deductions_80d: float = Field(25000.0, ge=0.0)
    hra_exemption: float = Field(0.0, ge=0.0)


class OfferCompareRequest(BaseModel):
    offer_a: Dict[str, Any]
    offer_b: Dict[str, Any]


class GovtCompareRequest(BaseModel):
    tech_ctc: float = Field(..., ge=0)
    post_id: str = Field("GOV_SSC_IT_INSPECTOR")
    city_tier: str = Field("X")


@app.get("/")
def serve_index():
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "CTC Compass India API is online."}


@app.get("/api/metadata")
def get_metadata():
    return {
        "metadata": UNIFIED_DATA.get("metadata", {}),
        "tax_engine": UNIFIED_DATA.get("tax_and_payroll_engine", {}),
        "total_companies": len(UNIFIED_DATA.get("companies", [])),
        "total_gov_profiles": len(UNIFIED_DATA.get("government_and_psu", []))
    }


@app.get("/api/companies")
def search_companies(
    q: Optional[str] = Query(None, description="Search company name or industry"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    min_ctc: Optional[float] = Query(None, description="Filter min CTC in INR"),
    max_ctc: Optional[float] = Query(None, description="Filter max CTC in INR")
):
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

        observations = comp.get("compensation_observations", [])
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
    for comp in UNIFIED_DATA.get("companies", []):
        if comp["company_id"].upper() == company_id.upper():
            return comp
    raise HTTPException(status_code=404, detail="Company not found")


@app.get("/api/government/posts")
def get_government_posts():
    """Retrieve all curated Government & PSU profiles."""
    return {
        "count": len(UNIFIED_DATA.get("government_and_psu", [])),
        "profiles": UNIFIED_DATA.get("government_and_psu", [])
    }


@app.post("/api/calculate")
def calculate_take_home(req: CalculateRequest):
    old_deductions = {
        "80c": req.deductions_80c,
        "80d": req.deductions_80d,
        "hra": req.hra_exemption
    } if req.tax_regime == "old" else None

    return deconstruct_ctc(
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


@app.post("/api/compare")
def compare_offers(req: OfferCompareRequest):
    return compare_two_offers(req.offer_a, req.offer_b)


@app.post("/api/govt-compare")
def compare_tech_government(req: GovtCompareRequest):
    profiles = UNIFIED_DATA.get("government_and_psu", [])
    matching_profile = None
    for p in profiles:
        if p.get("post_id") == req.post_id:
            matching_profile = p
            break
    if not matching_profile and profiles:
        matching_profile = profiles[0]

    return compare_private_vs_public(
        tech_ctc=req.tech_ctc,
        profile=matching_profile,
        city_tier=req.city_tier
    )
