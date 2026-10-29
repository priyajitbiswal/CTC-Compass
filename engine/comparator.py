"""
CTC Compass India — Offer Clash & Comparative Analysis Engine
"""

from typing import Dict, Any
from engine.calculator import deconstruct_ctc


def compare_two_offers(offer_a: Dict[str, Any], offer_b: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares two private compensation offers side-by-side across:
      1. Liquid Monthly In-Hand Cash
      2. 1st-Year Cash Flow vs Sustainable 2nd-Year Cash Flow
      3. At-Risk Component (Variable Pay + Equity cliffs)
      4. Actionable Decision Matrix
    """
    res_a = deconstruct_ctc(
        annual_ctc=offer_a.get("ctc", 0.0),
        basic_pct=offer_a.get("basic_pct", 40.0),
        variable_pct=offer_a.get("variable_pct", 10.0),
        joining_bonus=offer_a.get("joining_bonus", 0.0),
        retention_bonus=offer_a.get("retention_bonus", 0.0),
        annual_equity=offer_a.get("annual_equity", 0.0),
        cap_epf_at_statutory_ceiling=offer_a.get("cap_epf", True)
    )

    res_b = deconstruct_ctc(
        annual_ctc=offer_b.get("ctc", 0.0),
        basic_pct=offer_b.get("basic_pct", 40.0),
        variable_pct=offer_b.get("variable_pct", 10.0),
        joining_bonus=offer_b.get("joining_bonus", 0.0),
        retention_bonus=offer_b.get("retention_bonus", 0.0),
        annual_equity=offer_b.get("annual_equity", 0.0),
        cap_epf_at_statutory_ceiling=offer_b.get("cap_epf", True)
    )

    name_a = offer_a.get("name", "Offer A")
    name_b = offer_b.get("name", "Offer B")

    monthly_diff = res_a["monthly_pay_slip"]["monthly_fixed_in_hand"] - res_b["monthly_pay_slip"]["monthly_fixed_in_hand"]
    year1_net_diff = res_a["annual_cash_summary"]["year1_net_in_hand"] - res_b["annual_cash_summary"]["year1_net_in_hand"]
    year2_net_diff = res_a["annual_cash_summary"]["year2_net_in_hand"] - res_b["annual_cash_summary"]["year2_net_in_hand"]

    # Risk factor: (Variable % + Equity %)
    risk_a = res_a["metrics"]["at_risk_variable_ratio_pct"] + res_a["metrics"]["paper_wealth_equity_pct"]
    risk_b = res_b["metrics"]["at_risk_variable_ratio_pct"] + res_b["metrics"]["paper_wealth_equity_pct"]

    # Decision Recommendation
    if monthly_diff > 3000 and year2_net_diff > 0:
        verdict = f"{name_a} provides significantly higher monthly liquidity and sustainable long-term cash flow."
        recommended_winner = name_a
    elif monthly_diff < -3000 and year2_net_diff < 0:
        verdict = f"{name_b} provides significantly higher monthly liquidity and sustainable long-term cash flow."
        recommended_winner = name_b
    elif abs(monthly_diff) <= 3000:
        if risk_a < risk_b:
            verdict = f"Both offers have comparable in-hand cash, but {name_a} carries lower risk with higher guaranteed fixed pay."
            recommended_winner = name_a
        else:
            verdict = f"Both offers have comparable in-hand cash, but {name_b} carries lower risk with higher guaranteed fixed pay."
            recommended_winner = name_b
    else:
        verdict = "Tradeoff depends on whether you prefer upfront bonus cash (Year 1) vs higher steady monthly in-hand."
        recommended_winner = name_a if year1_net_diff > 0 else name_b

    return {
        "offer_a": {
            "name": name_a,
            "data": res_a
        },
        "offer_b": {
            "name": name_b,
            "data": res_b
        },
        "comparison": {
            "monthly_in_hand_diff_inr": monthly_diff,
            "year1_net_cash_diff_inr": year1_net_diff,
            "year2_net_cash_diff_inr": year2_net_diff,
            "risk_score_a": round(risk_a, 1),
            "risk_score_b": round(risk_b, 1),
            "recommended_winner": recommended_winner,
            "verdict": verdict
        }
    }

