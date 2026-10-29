"""
CTC Compass India — Central Government Pay & 'Tech vs Sarkari' Comparator
Governing Framework: 7th Central Pay Commission (CPC) Rules & Allowances
"""

from typing import Dict, Any, Optional
from engine.calculator import calculate_new_regime_tax_2026, deconstruct_ctc

PAY_MATRIX_LEVELS = {
    "Level 8": {"entry_basic": 47600, "scale_max": 151100, "ta_base_higher": 3600, "ta_base_other": 1800, "cghs": 650},
    "Level 7": {"entry_basic": 44900, "scale_max": 142400, "ta_base_higher": 3600, "ta_base_other": 1800, "cghs": 650},
    "Level 6": {"entry_basic": 35400, "scale_max": 112400, "ta_base_higher": 3600, "ta_base_other": 1800, "cghs": 450},
    "Level 5": {"entry_basic": 29200, "scale_max": 92300, "ta_base_higher": 3600, "ta_base_other": 1800, "cghs": 250},
    "Level 4": {"entry_basic": 25500, "scale_max": 81100, "ta_base_higher": 3600, "ta_base_other": 1800, "cghs": 250}
}

HRA_RATES = {
    "X": 0.30,  # Tier 1 Metros (Delhi, Mumbai, Bengaluru, Chennai, etc.)
    "Y": 0.20,  # Tier 2 Cities
    "Z": 0.10   # Tier 3 / Rural
}


def calculate_government_salary(
    pay_level: str = "Level 7",
    custom_basic_monthly: Optional[float] = None,
    da_rate_pct: float = 50.0,
    city_tier: str = "X",
    govt_quarters_opted: bool = False
) -> Dict[str, Any]:
    """
    Computes true monthly and annual take-home salary for Central Government posts.
    """
    level_info = PAY_MATRIX_LEVELS.get(pay_level, PAY_MATRIX_LEVELS["Level 7"])
    basic_monthly = float(custom_basic_monthly) if custom_basic_monthly else float(level_info["entry_basic"])

    # 1. Dearness Allowance (DA)
    da_multiplier = da_rate_pct / 100.0
    da_monthly = round(basic_monthly * da_multiplier)

    # 2. House Rent Allowance (HRA)
    hra_multiplier = HRA_RATES.get(city_tier.upper(), 0.30)
    hra_monthly = 0 if govt_quarters_opted else round(basic_monthly * hra_multiplier)

    # 3. Transport Allowance (TA + DA on TA)
    ta_base = level_info["ta_base_higher"] if city_tier.upper() == "X" else level_info["ta_base_other"]
    ta_da = round(ta_base * da_multiplier)
    total_ta_monthly = ta_base + ta_da

    # Gross Monthly Pay
    gross_monthly = basic_monthly + da_monthly + hra_monthly + total_ta_monthly
    gross_annual = gross_monthly * 12.0

    # 4. Statutory Deductions
    # NPS Employee Contribution: 10% of (Basic + DA)
    nps_employee_monthly = round((basic_monthly + da_monthly) * 0.10)
    # CGHS (Central Govt Health Scheme)
    cghs_monthly = level_info["cghs"]
    # CGEGIS
    cgegis_monthly = 60

    # 5. Employer NPS Contribution (14% of Basic + DA - wealth accumulation perk)
    nps_govt_monthly = round((basic_monthly + da_monthly) * 0.14)

    # 6. Income Tax TDS
    tax_res = calculate_new_regime_tax_2026(annual_salary=gross_annual)
    monthly_tds = tax_res["monthly_tds"]

    # Net In-Hand Monthly
    total_monthly_deductions = nps_employee_monthly + cghs_monthly + cgegis_monthly + monthly_tds
    net_in_hand_monthly = round(gross_monthly - total_monthly_deductions)
    net_in_hand_annual = round(net_in_hand_monthly * 12.0)

    # Total Economic Value (Gross + Govt NPS 14% contribution)
    total_economic_package_annual = round(gross_annual + (nps_govt_monthly * 12.0))

    return {
        "pay_level": pay_level,
        "city_tier": city_tier.upper(),
        "monthly_pay_slip": {
            "basic_pay": basic_monthly,
            "da": da_monthly,
            "da_rate_pct": da_rate_pct,
            "hra": hra_monthly,
            "transport_allowance": total_ta_monthly,
            "gross_monthly": gross_monthly,
            "deductions": {
                "nps_employee": nps_employee_monthly,
                "cghs_health": cghs_monthly,
                "cgegis_insurance": cgegis_monthly,
                "income_tax_tds": monthly_tds,
                "total_deductions": total_monthly_deductions
            },
            "net_in_hand_monthly": net_in_hand_monthly
        },
        "annual_summary": {
            "gross_annual": gross_annual,
            "net_in_hand_annual": net_in_hand_annual,
            "govt_nps_perk_annual": nps_govt_monthly * 12.0,
            "total_economic_value_annual": total_economic_package_annual
        },
        "tax_calculation": tax_res
    }


def compare_tech_vs_sarkari(
    tech_ctc: float,
    govt_post_name: str = "Inspector of Income Tax / ASO",
    govt_pay_level: str = "Level 7",
    city_tier: str = "X",
    da_rate_pct: float = 50.0
) -> Dict[str, Any]:
    """
    Direct head-to-head comparison between a Private Tech offer and a Central Government post.
    """
    private_res = deconstruct_ctc(annual_ctc=tech_ctc)
    govt_res = calculate_government_salary(
        pay_level=govt_pay_level,
        city_tier=city_tier,
        da_rate_pct=da_rate_pct
    )

    pvt_monthly = private_res["monthly_pay_slip"]["monthly_fixed_in_hand"]
    govt_monthly = govt_res["monthly_pay_slip"]["net_in_hand_monthly"]

    monthly_difference = pvt_monthly - govt_monthly

    return {
        "private_tech": {
            "headline_ctc": tech_ctc,
            "monthly_in_hand": pvt_monthly,
            "annual_in_hand": private_res["annual_cash_summary"]["year1_net_in_hand"],
            "job_security_rating": "Moderate / Market Dependent",
            "working_hours_weekly": "45 - 55 hours",
            "pension": "EPF Corpus only",
            "upside_potential": "High (Faster pay raises, promotions, ESOPs)"
        },
        "central_government": {
            "post_name": govt_post_name,
            "pay_level": govt_pay_level,
            "monthly_in_hand": govt_monthly,
            "annual_in_hand": govt_res["annual_summary"]["net_in_hand_annual"],
            "annual_economic_package": govt_res["annual_summary"]["total_economic_value_annual"],
            "job_security_rating": "10/10 (Guaranteed Central Govt Service)",
            "working_hours_weekly": "38 - 40 hours (Standard Govt Timings)",
            "pension": "NPS + 14% Government Matching Contribution + Lifetime CGHS Medical",
            "upside_potential": "Steady, predictable (Annual increments + biannual DA + promotions)"
        },
        "verdict": {
            "in_hand_difference_monthly": monthly_difference,
            "summary": (
                f"Private tech pays ₹{abs(monthly_difference):,.0f}/mo more in liquid cash."
                if monthly_difference > 0 else
                f"Central Govt Level {govt_pay_level} matches or exceeds this private offer by ₹{abs(monthly_difference):,.0f}/mo in cash, with total job security."
            )
        }
    }
