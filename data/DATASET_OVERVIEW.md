# CTC Compass India — Consolidated Dataset Overview

**Last Updated:** 29 October 2026  
**Dataset Version:** 3.0.0 (Curated, Deduplicated & Verified)

---

## 1. Directory Structure

```
data/
├── ctc_compass_unified.json             # 🚀 Flagship Unified Store: Pre-joined hierarchical data for instant app usage
├── companies_master.csv                 # Canonical tech employers with official sites and verified career links
├── compensation_observations_master.csv # Granular salary observations (base, variable, bonus, equity, PF)
├── campus_company_crosswalk.csv         # Campus recruitment listings mapped to canonical employers
├── government_posts_master.csv          # 7th CPC central posts (Levels 4 through 8, SSC/UPSC/RRB)
├── government_pay_rules_master.csv      # Statutory pay rules (Pay matrix, DA revisions, HRA tiering)
├── tax_payroll_rules_master.csv         # Statutory tax and payroll rules (Income-tax Act, 2025, EPF, Gratuity)
├── sources_master.csv                   # Audited source references (CBDT, DoE, EPFO, official company sites)
└── calculation_spec_draft.md            # Tax Year 2026-27 statutory tax & salary algorithm test vectors
```

---

## 2. Summary Statistics

| Table / Entity | Total Records | Identifier | Key Features |
| :--- | :---: | :--- | :--- |
| **Showcased Verified Companies** | 85 | `company_id` | Top Global Tech, Product Unicorns, FinTech, IT Services (zero unlisted) |
| **Government & PSU Profiles** | 19 | `post_id` | All India Services (IAS/IPS/IFS), ISRO, DRDO, PSUs (ONGC/IOCL), Banking (RBI/SBI) |
| **Compensation Observations** | 126+ | `observation_id` | Annual CTC (₹3.36 LPA to ₹55.0 LPA), granular component breakdowns |
| **Campus Crosswalk Mappings** | 60 | `company_id` | Preserved user-provided campus leads (e.g. HyperVerge, Futures First) |
| **Tax & Payroll Rules** | 20 | `rule_id` | Income-tax Act, 2025 (FY 2026-27), EPF ceiling, Labour codes |
| **Audited Sources** | 111 | `source_id` | Primary government orders, official portals, salary aggregators |

---

## 3. The Unified JSON Store (`ctc_compass_unified.json`)

To eliminate complex joins across multiple CSVs during runtime, `ctc_compass_unified.json` pre-joins all entities into an object graph:

```json
{
  "metadata": { ... },
  "companies": [
    {
      "company_id": "TECH_GOOGLE",
      "company_name": "Google India",
      "canonical_name": "Google",
      "industry_category": "Global Big Tech & Internet",
      "official_website": "https://www.google.com",
      "careers_url": "https://careers.google.com/locations/india",
      "campus_reports": [ ... ],
      "compensation_observations": [ ... ]
    }
  ],
  "government_and_psu": [
    {
      "post_id": "GOV_IAS_SDM",
      "title": "IAS Officer (Sub-Divisional Magistrate / SDM)",
      "service_category": "All India Services (UPSC CSE)",
      "pay_level": "Level 10",
      "basic_monthly": 56100,
      "scale": "₹56,100 - ₹1,77,500",
      "perks": [ ... ]
    }
  ],
  "tax_and_payroll_engine": {
    "tax_year": "2026-27",
    "new_regime_slabs": [ ... ],
    "standard_deduction": { "new_regime_inr": 75000, "old_regime_inr": 50000 },
    "section_156_rebate": { "effective_zero_tax_threshold_salary_inr": 1275000 },
    "test_vectors": [ ... ]
  }
}
```

---

## 4. Key Calculation Rules & Formulas

### A. Tax Year 2026-27 New Tax Regime Slabs
- **₹0 – ₹4,00,000:** 0%
- **₹4,00,001 – ₹8,00,000:** 5%
- **₹8,00,001 – ₹12,00,000:** 10%
- **₹12,00,001 – ₹16,00,000:** 15%
- **₹16,00,001 – ₹20,00,000:** 20%
- **₹20,00,001 – ₹24,00,000:** 25%
- **Above ₹24,00,000:** 30%

### B. Standard Deduction & Section 156(2) Full Rebate
- **Standard Deduction:** `min(salary, ₹75,000)` under the new regime.
- **Section 156(2) Rebate:** Up to ₹60,000 for taxable income $\le$ ₹12,00,000.
- **Zero-Tax Cap:** Any salaried employee with an annual taxable salary up to **₹12,75,000** pays **₹0 income tax**.
- **Statutory Rounding:** Section 288B rounds total tax to the nearest multiple of ten rupees.

### C. Statutory Deductions
- **Employee EPF:** 12% of basic pay (subject to the ₹15,000/month statutory wage ceiling = ₹1,800/month default, or uncapped if opted).
- **Gratuity:** Calculated as `(15 / 26) * Basic / 12 * Tenure` (~4.81% of basic salary).
- **Professional Tax:** State-specific, capped at ₹2,500/year (~₹200/month in most IT hubs).
