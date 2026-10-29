"""
CTC Compass India — Core Compensation & Statutory Tax Engine
Governing framework: Income-tax Act, 2025 & Finance Act, 2026 (Tax Year 2026-27)
"""

from typing import Dict, Any, Optional

NEW_REGIME_SLABS_2026 = [
    (0, 400000, 0.0),
    (400000, 800000, 0.05),
    (800000, 1200000, 0.10),
    (1200000, 1600000, 0.15),
    (1600000, 2000000, 0.20),
    (2000000, 2400000, 0.25),
    (2400000, float("inf"), 0.30)
]

OLD_REGIME_SLABS = [
    (0, 250000, 0.0),
    (250000, 500000, 0.05),
    (500000, 1000000, 0.20),
    (1000000, float("inf"), 0.30)
]


def round_tax_statutory(val: float) -> int:
    """Rounds off tax to the nearest multiple of ten rupees under Section 288B."""
    if val <= 0:
        return 0
    return int(round(val / 10.0) * 10)


def calculate_progressive_tax(taxable_income: float, slabs) -> float:
    """Calculates progressive slab tax without rebate, surcharge, or cess."""
    if taxable_income <= 0:
        return 0.0

    total_tax = 0.0
    for slab_min, slab_max, rate in slabs:
        if taxable_income > slab_min:
            taxable_in_slab = min(taxable_income, slab_max) - slab_min
            total_tax += taxable_in_slab * rate
        else:
            break
    return total_tax


def calculate_new_regime_tax_2026(
    annual_salary: float,
    other_income: float = 0.0,
    itemized_deductions: float = 0.0
) -> Dict[str, Any]:
    """
    Computes income tax under the New Tax Regime for Tax Year 2026-27.
    Statutory references:
      - Income-tax Act, 2025 s.202(1) (Progressive 7-Slab Structure)
      - Income-tax Act, 2025 s.19(1) (Standard deduction ₹75,000 for salaried employees)
      - Income-tax Act, 2025 s.156(2) (Rebate up to ₹60,000 for income <= ₹12L, plus marginal relief)
      - Finance Act, 2026 (4% Cess, Surcharge capped at 25% under Section 202)
      - Income-tax Act, 2025 s.288B (Rounding off to nearest multiple of ₹10)
    """
    standard_deduction = min(annual_salary, 75000.0)
    gross_income = annual_salary + other_income
    taxable_income = max(0.0, gross_income - standard_deduction - itemized_deductions)

    # 1. Progressive slab tax
    slab_tax = calculate_progressive_tax(taxable_income, NEW_REGIME_SLABS_2026)

    # 2. Section 156(2) Rebate and Marginal Relief
    rebate = 0.0
    marginal_relief = 0.0
    tax_after_rebate = slab_tax

    if taxable_income <= 1200000.0:
        rebate = min(slab_tax, 60000.0)
        tax_after_rebate = max(0.0, slab_tax - rebate)
    else:
        # Marginal relief: Tax on total income cannot exceed the income exceeding ₹12,00,000
        excess_income = taxable_income - 1200000.0
        if slab_tax > excess_income:
            marginal_relief = slab_tax - excess_income
            tax_after_rebate = excess_income

    # 3. Surcharge (capped at 25% under new regime)
    surcharge_rate = 0.0
    if taxable_income > 50000000:
        surcharge_rate = 0.25  # Capped at 25% (Section 202)
    elif taxable_income > 20000000:
        surcharge_rate = 0.25
    elif taxable_income > 10000000:
        surcharge_rate = 0.15
    elif taxable_income > 5000000:
        surcharge_rate = 0.10

    surcharge = tax_after_rebate * surcharge_rate

    # 4. Health & Education Cess (4%)
    cess = 0.04 * (tax_after_rebate + surcharge)

    total_annual_tax = round_tax_statutory(tax_after_rebate + surcharge + cess)
    monthly_tds = round(total_annual_tax / 12.0)

    effective_rate = (total_annual_tax / annual_salary * 100.0) if annual_salary > 0 else 0.0

    return {
        "regime": "new_2026_27",
        "gross_salary": annual_salary,
        "standard_deduction": standard_deduction,
        "taxable_income": taxable_income,
        "slab_tax": slab_tax,
        "rebate": rebate,
        "marginal_relief": marginal_relief,
        "tax_before_cess": tax_after_rebate + surcharge,
        "surcharge": surcharge,
        "cess": cess,
        "total_annual_tax": total_annual_tax,
        "monthly_tds": monthly_tds,
        "effective_tax_rate": round(effective_rate, 2)
    }


def calculate_old_regime_tax(
    annual_salary: float,
    deductions_80c: float = 150000.0,
    deductions_80d: float = 25000.0,
    hra_exemption: float = 0.0,
    other_deductions: float = 0.0
) -> Dict[str, Any]:
    """Computes income tax under the Old Tax Regime for comparison."""
    standard_deduction = min(annual_salary, 50000.0)
    total_deductions = standard_deduction + min(deductions_80c, 150000.0) + min(deductions_80d, 50000.0) + hra_exemption + other_deductions
    taxable_income = max(0.0, annual_salary - total_deductions)

    slab_tax = calculate_progressive_tax(taxable_income, OLD_REGIME_SLABS)

    # Section 87A rebate under old regime (income up to ₹5,00,000)
    rebate = 0.0
    if taxable_income <= 500000.0:
        rebate = min(slab_tax, 12500.0)
    tax_after_rebate = max(0.0, slab_tax - rebate)

    # Surcharge
    surcharge_rate = 0.0
    if taxable_income > 50000000:
        surcharge_rate = 0.37
    elif taxable_income > 20000000:
        surcharge_rate = 0.25
    elif taxable_income > 10000000:
        surcharge_rate = 0.15
    elif taxable_income > 5000000:
        surcharge_rate = 0.10

    surcharge = tax_after_rebate * surcharge_rate
    cess = 0.04 * (tax_after_rebate + surcharge)
    total_annual_tax = round_tax_statutory(tax_after_rebate + surcharge + cess)
    monthly_tds = round(total_annual_tax / 12.0)

    effective_rate = (total_annual_tax / annual_salary * 100.0) if annual_salary > 0 else 0.0

    return {
        "regime": "old",
        "gross_salary": annual_salary,
        "standard_deduction": standard_deduction,
        "total_deductions": total_deductions,
        "taxable_income": taxable_income,
        "slab_tax": slab_tax,
        "rebate": rebate,
        "tax_before_cess": tax_after_rebate + surcharge,
        "surcharge": surcharge,
        "cess": cess,
        "total_annual_tax": total_annual_tax,
        "monthly_tds": monthly_tds,
        "effective_tax_rate": round(effective_rate, 2)
    }


def deconstruct_ctc(
    annual_ctc: float,
    basic_pct: float = 40.0,
    variable_pct: float = 10.0,
    joining_bonus: float = 0.0,
    retention_bonus: float = 0.0,
    annual_equity: float = 0.0,
    cap_epf_at_statutory_ceiling: bool = True,
    include_gratuity_in_ctc: bool = True,
    include_insurance_in_ctc: bool = True,
    annual_insurance_cost: float = 25000.0,
    annual_professional_tax: float = 2400.0,
    tax_regime: str = "new",
    old_regime_deductions: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Deconstructs a headline CTC into its true economic and cash components.
    
    Distinguishes:
      1. Employer costs deducted from CTC (Employer PF, Gratuity, Insurance)
      2. Gross Cash Pay (Basic, HRA, Special Allowance, Variable, Bonuses)
      3. Statutory Employee Deductions (Employee PF, Professional Tax, TDS)
      4. Monthly In-Hand Cash Flow (Year 1 with bonuses vs Year 2+ sustainable)
    """
    annual_ctc = max(0.0, float(annual_ctc))
    basic_ratio = max(0.20, min(0.60, basic_pct / 100.0))
    variable_ratio = max(0.0, min(0.50, variable_pct / 100.0))

    # One-time cash & equity separated from base CTC
    non_salary_in_ctc = annual_equity
    ctc_for_cash_structure = max(0.0, annual_ctc - non_salary_in_ctc)

    # Basic Salary estimation
    estimated_basic = round(ctc_for_cash_structure * basic_ratio)

    # Statutory EPF: 12% of basic
    if cap_epf_at_statutory_ceiling:
        annual_epf_per_side = min(estimated_basic * 0.12, 21600.0)
    else:
        annual_epf_per_side = round(estimated_basic * 0.12)

    employer_epf = annual_epf_per_side
    employee_epf = annual_epf_per_side

    # Gratuity: ~4.81% of basic pay (15/26 days per year under Payment of Gratuity Act)
    gratuity = round(estimated_basic * 0.0481) if include_gratuity_in_ctc else 0.0

    # Group Medical Insurance
    insurance = annual_insurance_cost if include_insurance_in_ctc else 0.0

    # Employer Overheads deducted from CTC
    total_employer_overheads = employer_epf + gratuity + insurance

    # Total Gross Cash pool available for employee
    gross_cash_annual = max(0.0, ctc_for_cash_structure - total_employer_overheads)

    # Break gross cash into fixed vs variable components
    annual_variable_target = round(gross_cash_annual * variable_ratio)
    annual_fixed_gross = max(0.0, gross_cash_annual - annual_variable_target)

    # Reconcile payslip components so Basic + HRA + Special Allowance ALWAYS exactly equals fixed gross
    # Standard: Basic ~40-50%, HRA ~40% of Basic.
    # If basic + hra would exceed annual_fixed_gross, scale basic down cleanly.
    if estimated_basic * 1.40 > annual_fixed_gross:
        fixed_basic = round(annual_fixed_gross / 1.40)
    else:
        fixed_basic = estimated_basic

    hra = round(fixed_basic * 0.40)
    special_allowance = max(0.0, annual_fixed_gross - fixed_basic - hra)

    # Total Year 1 Gross Taxable Cash (including bonuses)
    total_year1_gross = annual_fixed_gross + annual_variable_target + joining_bonus + retention_bonus
    # Recurring Year 2 Gross Cash (excluding one-time bonuses)
    total_year2_gross = annual_fixed_gross + annual_variable_target

    # Compute Income Tax
    if tax_regime == "old" and old_regime_deductions:
        tax_res = calculate_old_regime_tax(
            annual_salary=total_year1_gross,
            deductions_80c=old_regime_deductions.get("80c", 150000.0),
            deductions_80d=old_regime_deductions.get("80d", 25000.0),
            hra_exemption=old_regime_deductions.get("hra", 0.0)
        )
    else:
        tax_res = calculate_new_regime_tax_2026(annual_salary=total_year1_gross)

    annual_tds = tax_res["total_annual_tax"]
    monthly_tds = tax_res["monthly_tds"]

    # Year 2 tax estimation (sustainable without joining bonus)
    tax_res_y2 = calculate_new_regime_tax_2026(annual_salary=total_year2_gross)
    annual_tds_y2 = tax_res_y2["total_annual_tax"]
    monthly_tds_y2 = tax_res_y2["monthly_tds"]

    # Monthly Employee Deductions
    monthly_employee_pf = round(employee_epf / 12.0)
    monthly_prof_tax = round(annual_professional_tax / 12.0)
    total_monthly_statutory_deductions = monthly_employee_pf + monthly_prof_tax + monthly_tds

    # Monthly In-Hand (Guaranteed Recurring Base: Basic + HRA + Special Allowance)
    monthly_fixed_gross = round(annual_fixed_gross / 12.0)
    monthly_basic = round(fixed_basic / 12.0)
    monthly_hra = round(hra / 12.0)
    # Ensure exact sum balance: monthly_basic + monthly_hra + monthly_special == monthly_fixed_gross
    monthly_special = max(0, monthly_fixed_gross - monthly_basic - monthly_hra)

    monthly_fixed_in_hand = max(0, monthly_fixed_gross - total_monthly_statutory_deductions)

    # Monthly In-Hand assuming variable pay paid out monthly or quarterly averaged
    monthly_variable_amortized = round(annual_variable_target / 12.0)
    monthly_total_in_hand_avg = monthly_fixed_in_hand + monthly_variable_amortized

    # Total Net Annual Cash (Year 1 vs Year 2)
    annual_employee_deductions_y1 = employee_epf + annual_professional_tax + annual_tds
    net_in_hand_annual_y1 = max(0.0, total_year1_gross - annual_employee_deductions_y1)

    annual_employee_deductions_y2 = employee_epf + annual_professional_tax + annual_tds_y2
    net_in_hand_annual_y2 = max(0.0, total_year2_gross - annual_employee_deductions_y2)

    # CTC Reality Ratio: Net cash in-hand vs headline CTC
    cash_realization_pct = (net_in_hand_annual_y1 / annual_ctc * 100.0) if annual_ctc > 0 else 0.0

    return {
        "headline_ctc": annual_ctc,
        "ctc_summary": {
            "fixed_cash_annual": annual_fixed_gross,
            "variable_cash_annual": annual_variable_target,
            "joining_bonus_one_time": joining_bonus,
            "retention_bonus": retention_bonus,
            "equity_annual_vest": annual_equity,
            "employer_overhead_annual": total_employer_overheads
        },
        "monthly_pay_slip": {
            "fixed_gross": monthly_fixed_gross,
            "breakdown": {
                "basic_pay": monthly_basic,
                "hra": monthly_hra,
                "special_allowance": monthly_special
            },
            "deductions": {
                "employee_pf": monthly_employee_pf,
                "professional_tax": monthly_prof_tax,
                "income_tax_tds": monthly_tds,
                "total_deductions": total_monthly_statutory_deductions
            },
            "monthly_fixed_in_hand": monthly_fixed_in_hand,
            "monthly_variable_amortized": monthly_variable_amortized,
            "monthly_total_in_hand_avg": monthly_total_in_hand_avg
        },
        "annual_cash_summary": {
            "year1_gross_cash": total_year1_gross,
            "year1_net_in_hand": net_in_hand_annual_y1,
            "year2_gross_cash": total_year2_gross,
            "year2_net_in_hand": net_in_hand_annual_y2,
            "year2_monthly_in_hand": round(net_in_hand_annual_y2 / 12.0)
        },
        "employer_deductions": {
            "employer_epf": employer_epf,
            "gratuity": gratuity,
            "insurance": insurance,
            "total": total_employer_overheads
        },
        "tax_calculation": tax_res,
        "metrics": {
            "cash_realization_rate_pct": round(cash_realization_pct, 1),
            "guaranteed_fixed_ratio_pct": round((annual_fixed_gross / annual_ctc * 100.0) if annual_ctc > 0 else 0.0, 1),
            "at_risk_variable_ratio_pct": round((annual_variable_target / annual_ctc * 100.0) if annual_ctc > 0 else 0.0, 1),
            "paper_wealth_equity_pct": round((annual_equity / annual_ctc * 100.0) if annual_ctc > 0 else 0.0, 1)
        }
    }
