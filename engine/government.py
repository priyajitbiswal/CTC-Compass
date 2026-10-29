"""
CTC Compass India — Government & Public Sector Compensation Engine
Supports 7th CPC Central Civil Services, All India Services (IAS/IPS/IFS), 
Maharatna PSUs (ONGC, IOCL, NTPC), and Banking Regulators (RBI, SEBI, SBI).
"""

from typing import Dict, Any, Optional
from engine.calculator import calculate_new_regime_tax_2026, deconstruct_ctc

def calculate_public_sector_pay(
    profile: Dict[str, Any],
    city_tier: str = "X",
    custom_basic_monthly: Optional[float] = None
) -> Dict[str, Any]:
    """
    Computes exact monthly and annual pay breakdown for any Govt/PSU profile.
    """
    basic_monthly = float(custom_basic_monthly) if custom_basic_monthly else float(profile["basic_monthly"])
    da_rate = float(profile.get("da_rate_pct", 50.0))
    da_monthly = round(basic_monthly * (da_rate / 100.0))

    # HRA: Depends on city tier (X = 30%, Y = 20%, Z = 10% for Central Govt, or flat lease for RBI/Banking)
    if "hra_monthly" in profile and profile.get("service_category", "").startswith(("Apex Central Banking", "Securities Market", "Public Sector Banking")):
        # Banking leases vary by city
        lease_tier_factor = 1.0 if city_tier == "X" else 0.65 if city_tier == "Y" else 0.40
        hra_monthly = round(profile["hra_monthly"] * lease_tier_factor)
    else:
        tier_multipliers = {"X": 0.30, "Y": 0.20, "Z": 0.10}
        hra_multiplier = tier_multipliers.get(city_tier.upper(), 0.30)
        hra_monthly = round(basic_monthly * hra_multiplier)

    # Transport / Conveyance Allowance
    ta_monthly = profile.get("ta_monthly", 5400)
    special_allowances = profile.get("special_allowances", 0)

    # Total Gross Monthly
    gross_monthly = basic_monthly + da_monthly + hra_monthly + ta_monthly + special_allowances
    gross_annual = gross_monthly * 12.0

    # Deductions
    # NPS Employee Contribution: 10% of (Basic + DA)
    nps_employee_monthly = round((basic_monthly + da_monthly) * 0.10)
    cghs_monthly = 650 if basic_monthly > 40000 else 450
    prof_tax_monthly = 200

    # Tax TDS
    tax_res = calculate_new_regime_tax_2026(annual_salary=gross_annual)
    monthly_tds = tax_res["monthly_tds"]

    total_monthly_deductions = nps_employee_monthly + cghs_monthly + prof_tax_monthly + monthly_tds
    net_in_hand_monthly = max(0, round(gross_monthly - total_monthly_deductions))
    net_in_hand_annual = round(net_in_hand_monthly * 12.0)

    # Govt NPS Share: 14% of (Basic + DA)
    nps_govt_monthly = round((basic_monthly + da_monthly) * 0.14)
    total_economic_annual = round(gross_annual + (nps_govt_monthly * 12.0))

    return {
        "profile_id": profile.get("post_id"),
        "title": profile.get("title"),
        "service_category": profile.get("service_category"),
        "pay_level": profile.get("pay_level"),
        "scale": profile.get("scale"),
        "city_tier": city_tier.upper(),
        "monthly_breakdown": {
            "basic_pay": basic_monthly,
            "da": da_monthly,
            "da_rate_pct": da_rate,
            "hra_or_lease": hra_monthly,
            "transport_allowance": ta_monthly,
            "special_allowance": special_allowances,
            "gross_monthly": gross_monthly,
            "deductions": {
                "nps_employee": nps_employee_monthly,
                "cghs_medical": cghs_monthly,
                "professional_tax": prof_tax_monthly,
                "income_tax_tds": monthly_tds,
                "total_deductions": total_monthly_deductions
            },
            "net_in_hand_monthly": net_in_hand_monthly
        },
        "annual_summary": {
            "gross_annual": gross_annual,
            "net_in_hand_annual": net_in_hand_annual,
            "govt_nps_perk_annual": nps_govt_monthly * 12.0,
            "total_economic_value_annual": total_economic_annual
        },
        "perks": profile.get("perks", []),
        "work_hours": profile.get("work_hours", "40 hrs/week"),
        "job_security": profile.get("job_security", "10/10"),
        "promotions": profile.get("promotions", "Standard promotional cadre"),
        "source": profile.get("source", "Official Gazette")
    }


def compare_private_vs_public(
    tech_ctc: float,
    profile: Dict[str, Any],
    city_tier: str = "X"
) -> Dict[str, Any]:
    """
    Compares a private tech offer against a specific Public/Govt profile.
    """
    pvt = deconstruct_ctc(annual_ctc=tech_ctc)
    pub = calculate_public_sector_pay(profile=profile, city_tier=city_tier)

    pvt_monthly = pvt["monthly_pay_slip"]["monthly_fixed_in_hand"]
    pub_monthly = pub["monthly_breakdown"]["net_in_hand_monthly"]
    gap_monthly = pvt_monthly - pub_monthly

    return {
        "private_tech": {
            "headline_ctc": tech_ctc,
            "monthly_in_hand": pvt_monthly,
            "annual_in_hand": pvt["annual_cash_summary"]["year1_net_in_hand"],
            "job_security": "Moderate / Market Dependent",
            "working_hours": "45 - 55 hrs/week",
            "pension": "EPF Corpus only",
            "perks": "Health Insurance, Office Snacks, Remote Flexibility"
        },
        "public_sector": {
            "post_title": pub["title"],
            "service_category": pub["service_category"],
            "monthly_in_hand": pub_monthly,
            "annual_in_hand": pub["annual_summary"]["net_in_hand_annual"],
            "total_economic_annual": pub["annual_summary"]["total_economic_value_annual"],
            "job_security": pub["job_security"],
            "working_hours": pub["work_hours"],
            "perks": pub["perks"],
            "promotions": pub["promotions"],
            "monthly_breakdown": pub["monthly_breakdown"]
        },
        "verdict": {
            "in_hand_gap_monthly": gap_monthly,
            "pvt_leads": gap_monthly > 0,
            "summary": (
                f"Private IT offers ₹{abs(gap_monthly):,.0f}/month more in liquid bank deposits."
                if gap_monthly > 0 else
                f"{pub['title']} matches or beats this private package by ₹{abs(gap_monthly):,.0f}/month in liquid cash, with 10/10 job security and government perks."
            )
        }
    }


# Aliases for backward compatibility
def calculate_government_salary(pay_level="Level 7", custom_basic_monthly=None, da_rate_pct=50.0, city_tier="X", govt_quarters_opted=False):
    dummy_profile = {
        "post_id": "GOV_COMPAT",
        "title": f"7th CPC {pay_level} Post",
        "service_category": "Central Civil Services",
        "pay_level": pay_level,
        "basic_monthly": custom_basic_monthly or (47600 if pay_level == "Level 8" else 44900 if pay_level == "Level 7" else 35400 if pay_level == "Level 6" else 29200 if pay_level == "Level 5" else 25500),
        "scale": "Standard 7th CPC Matrix",
        "da_rate_pct": da_rate_pct,
        "ta_monthly": 5400,
        "special_allowances": 0
    }
    res = calculate_public_sector_pay(dummy_profile, city_tier=city_tier)
    return {
        "pay_level": pay_level,
        "city_tier": city_tier,
        "monthly_pay_slip": {
            "basic_pay": res["monthly_breakdown"]["basic_pay"],
            "da": res["monthly_breakdown"]["da"],
            "da_rate_pct": res["monthly_breakdown"]["da_rate_pct"],
            "hra": res["monthly_breakdown"]["hra_or_lease"],
            "transport_allowance": res["monthly_breakdown"]["transport_allowance"],
            "gross_monthly": res["monthly_breakdown"]["gross_monthly"],
            "deductions": res["monthly_breakdown"]["deductions"],
            "net_in_hand_monthly": res["monthly_breakdown"]["net_in_hand_monthly"]
        },
        "annual_summary": res["annual_summary"]
    }

def compare_tech_vs_sarkari(tech_ctc, govt_post_name="Inspector of Income Tax", govt_pay_level="Level 7", city_tier="X", da_rate_pct=50.0):
    dummy_profile = {
        "post_id": "GOV_COMPAT",
        "title": govt_post_name,
        "service_category": "Central Civil Services",
        "pay_level": govt_pay_level,
        "basic_monthly": 44900 if govt_pay_level == "Level 7" else 47600,
        "da_rate_pct": da_rate_pct,
        "ta_monthly": 5400,
        "special_allowances": 0,
        "job_security": "10/10",
        "work_hours": "38 - 40 hrs/week",
        "perks": ["CGHS Medical", "Type IV Quarters"]
    }
    res = compare_private_vs_public(tech_ctc=tech_ctc, profile=dummy_profile, city_tier=city_tier)
    return {
        "private_tech": res["private_tech"],
        "central_government": res["public_sector"],
        "verdict": {
            "in_hand_difference_monthly": res["verdict"]["in_hand_gap_monthly"],
            "summary": res["verdict"]["summary"]
        }
    }
