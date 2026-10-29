# CTC Compass India — Consolidated Dataset Overview

**Last Updated:** 29 October 2026  
**Dataset Version:** 2.0.0 (Unified & Deduplicated)  

---

## 1. Directory Structure

```
data/
├── ctc_compass_unified.json             # 🚀 Flagship Unified Store: Pre-joined hierarchical data for instant app usage
├── companies_master.csv                 # 150 canonical tech employers with official sites and verified career links
├── compensation_observations_master.csv # 126 granular salary observations (base, variable, bonus, equity, PF)
├── campus_company_crosswalk.csv         # 60 campus recruitment listings mapped to canonical employers
├── government_posts_master.csv          # 11 deduplicated 7th CPC central posts (Levels 4 through 8, SSC/UPSC/RRB)
├── government_pay_rules_master.csv      # 8 statutory pay rules (Pay matrix, DA revisions, HRA tiering)
├── tax_payroll_rules_master.csv         # 20 tax and statutory payroll rules (Income-tax Act, 2025, EPF, Gratuity)
├── sources_master.csv                   # 111 audited source references (CBDT, DoE, EPFO, official company sites)
├── calculation_spec_draft.md            # Tax Year 2026-27 statutory tax & salary algorithm test vectors
└── archive_raw/                         # Historical research batch snapshots & duplicates (safely preserved)
```

---

## 2. Summary Statistics

| Table / Entity | Total Records | Primary Key / Identifier | Key Features |
| :--- | :---: | :--- | :--- |
| **Companies** | 150 | `company_id` (`COMP001` - `COMP150`) | IT services, Product MNCs, Startups, FinTech, Semiconductors |
| **Compensation Observations** | 126 | `observation_id` (`OBS001` - `OBS126`) | Annual CTC (₹3.0 LPA to ₹42.3 LPA), granular component breakdowns |
| **Campus Crosswalk Mappings** | 60 | `company_id` | Preserved user-provided campus leads (e.g. HyperVerge ₹14-19 LPA) |
| **Government Posts** | 11 | `government_post_id` (`GOV001` - `GOV013`) | Central 7th CPC Pay Matrix Levels 4–8 (deduplicated) |
| **Government Pay Rules** | 8 | `pay_rule_id` (`PAY001` - `PAY008`) | DA timelines, HRA (X, Y, Z tiers), TA rules |
| **Tax & Payroll Rules** | 20 | `rule_id` (`TR001` - `TR020`) | Income-tax Act, 2025 (FY 2026-27), EPF ceiling, Labour codes |
| **Audited Sources** | 111 | `source_id` (`SRC001` - `SRC111`) | Primary government orders, official portals, salary aggregators |

---

## 3. The Unified JSON Store (`ctc_compass_unified.json`)

To eliminate complex joins across multiple CSVs during runtime, `ctc_compass_unified.json` pre-joins all entities into an object graph:

```json
{
  "metadata": { ... },
  "companies": [
    {
      "company_id": "COMP001",
      "company_name": "Tata Consultancy Services",
      "canonical_name": "Tata Consultancy Services",
      "industry_category": "IT services and consulting",
      "official_website": "https://www.tcs.com",
      "careers_url": "https://www.tcs.com/careers",
      "campus_reports": [
        {
          "input_company_name": "TCS (Ninja)",
          "campus_ctc_min_lpa": 3.4,
          "campus_ctc_max_lpa": 3.4,
          "note": "Campus offer"
        }
      ],
      "compensation_observations": [
        {
          "observation_id": "OBS001",
          "job_title": "Ninja (undergraduate)",
          "experience_level": "Entry-level",
          "annual_ctc": { "min_inr": 340000, "max_inr": 340000, "amount_basis": "annual_ctc" },
          "breakdown_inr": { "base_salary": null, "variable_pay": null, ... },
          "confidence": "high",
          "source_url": "https://www.tcs.com/careers/india/entry-level-hiring"
        }
      ]
    }
  ],
  "government": {
    "posts": [ ... ],
    "pay_rules": [ ... ]
  },
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
- **Health & Education Cess:** 4% applied to tax after rebate and surcharge.

### C. Statutory Deductions
- **Employee EPF:** 12% of basic pay (subject to the ₹15,000/month statutory wage ceiling = ₹1,800/month default, or uncapped if opted).
- **Gratuity:** Calculated as `(15 / 26) * Basic / 12 * Tenure` (~4.81% of basic salary).
- **Professional Tax:** State-specific, capped at ₹2,500/year (typically ₹200/month in most IT hubs).

---

## 5. Verification & Confidence Guidelines
- **High Confidence:** Sourced directly from official company job postings, offer letters, or statutory government gazettes.
- **Medium Confidence:** Aggregated salary surveys (Levels.fyi, Glassdoor, Indeed) or community compensation threads with verified itemized breakdowns.
- **Low Confidence:** Uncorroborated campus self-reports. These are marked as directional indicators rather than audited salary commitments.

