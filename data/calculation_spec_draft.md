# CTC Compass India — Calculation specification draft
Research date: 2026-10-29
Scope: New-regime illustrative income-tax computation for Tax Year 2026-27 only.
Status: Draft for test design, not legal/tax advice. It omits surcharge and needs production verification against complete statutory text and tax rounding rules.

## Inputs
- annual_salary: annual taxable salary before standard deduction (INR)
- tax_regime: new or old
- tax_year: 2026-27
- other_income: optional; not included in example below
- eligible_deductions: itemized inputs; regime eligibility must be validated
- surcharge_applicable: derived from total income and statutory thresholds
- cess_rate: 4% as listed in official finance materials; validate current Finance Act table before production

## New-regime slab function (Tax Year 2026-27)
For taxable income x, calculate progressive tax:
- 0% on first ₹4,00,000
- 5% on ₹4,00,000–₹8,00,000
- 10% on ₹8,00,000–₹12,00,000
- 15% on ₹12,00,000–₹16,00,000
- 20% on ₹16,00,000–₹20,00,000
- 25% on ₹20,00,000–₹24,00,000
- 30% above ₹24,00,000

For salaried users, subtract standard deduction min(salary, ₹75,000) before applying slabs, subject to applicable rules.
Apply section 156 rebate/marginal relief only when eligibility requirements are met.
Apply surcharge where applicable, then cess according to statutory ordering. Production implementation must read and encode all applicable surcharge bands and marginal-relief limits from the current Finance Act.

## Pseudocode
1. Validate tax_year and regime.
2. taxable_income = salary + other_income - eligible_deductions_for_regime - standard_deduction_for_regime.
3. tax_before_rebate = progressive_tax(taxable_income, slab_table_for_tax_year).
4. rebate = calculate_rebate_and_marginal_relief(taxable_income, tax_before_rebate, statutory_limits).
5. tax_after_rebate = max(0, tax_before_rebate - rebate).
6. surcharge = calculate_surcharge_and_marginal_relief(taxable_income, tax_after_rebate, official_rate_table).
7. cess = 0.04 * (tax_after_rebate + surcharge), if 4% rate confirmed for tax year.
8. annual_tax = statutory_rounding(tax_after_rebate + surcharge + cess).
9. estimated_monthly_TDS = employer_payroll_projection(annual_tax, prior_TDS, remaining_pay_periods); do not simply annual_tax/12 when the tax year is in progress.
10. monthly_take_home = monthly_gross_cash - employee_PF - professional_tax - TDS - other_employee_deductions.
11. Do not subtract employer PF, gratuity or insurance from cash pay a second time if already excluded from gross cash; disclose the CTC reconciliation separately.

## Test vectors (new regime; assume salary only, no other income; surcharge excluded)
- Salary ₹12,00,000: standard deduction ₹75,000; taxable income ₹11,25,000; slab tax ₹52,500; rebate up to ₹52,500; income tax before cess = ₹0.
- Salary ₹13,00,000: standard deduction ₹75,000; taxable income ₹12,25,000; slab tax ₹63,750; marginal relief leaves ₹25,000 tax before cess; illustrative cess at 4% = ₹1,000; total ₹26,000.
- Salary ₹15,00,000: standard deduction ₹75,000; taxable income ₹14,25,000; slab tax ₹93,750; no rebate at this income; illustrative cess at 4% = ₹3,750; total ₹97,500.

These examples do not calculate take-home salary because PF base, variable pay, professional tax, employer benefits and actual salary structure are unknown.
