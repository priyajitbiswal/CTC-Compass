# CTC Compass India 🧭

> **Decode Pay. Compare Offers. Know Your Worth.**  
> Built with Python & FastAPI for Indian students, engineering freshers, job seekers, and working professionals.

---

## 🌟 Key Capabilities

1. **The CTC Reality Deconstructor**
   - Dissects headline CTC (e.g. "12 LPA") into actual guaranteed monthly in-hand cash vs employer overheads (Employer PF, Gratuity, Health Insurance).
   - Fully implements the **Income-tax Act, 2025** and **Finance Act, 2026** (Tax Year 2026-27):
     - New 7-slab progressive tax structure (0%, 5%, 10%, 15%, 20%, 25%, 30%).
     - ₹75,000 Standard Deduction.
     - Section 156(2) full rebate up to ₹60,000 (meaning **₹0 Tax on salaries up to ₹12.75 LPA**).
     - Statutory Marginal Relief calculations.
   - Models Year 1 cash flow (with one-time joining bonuses) vs sustainable Year 2+ recurring pay.

2. **Offer Clash (A vs B Duel)**
   - Head-to-head comparison between two competing job offers (e.g. High-variable startup vs High-fixed MNC).
   - Generates net cash flow differences, risk index (variable + stock cliffs), and actionable recommendations.

3. **Tech vs Sarkari (Private IT vs Central Government)**
   - Compares private tech packages against **7th CPC Central Civil Service Posts** (Levels 4 through 8, e.g. Assistant Audit Officer, Inspector of Income Tax, Assistant Section Officer).
   - Accurately models Dearness Allowance (DA 50%+), House Rent Allowance (X/Y/Z city tiers: 30%, 20%, 10%), Transport Allowance, and the 14% Government Matching NPS pension wealth.

4. **Verified Tech Salary & Campus Explorer**
   - Instant search and filtering across **150 canonical tech employers** in India.
   - 126 deduplicated salary observations with transparent confidence ratings (High / Medium / Low).
   - 60 campus placement drive benchmarks (HyperVerge, Futures First, HPE, HSBC, etc.).
   - Direct links to verified company careers portals and primary statutory references.

---

## 🚀 Quickstart

### Prerequisites
- Python 3.10+
- Installed packages: `fastapi`, `uvicorn`, `pydantic`

```bash
# Install dependencies
uv pip install fastapi uvicorn httpx pydantic --system
# or: pip install fastapi uvicorn httpx pydantic
```

### Running the Web Application
```bash
python run.py
```

Open your browser at:  
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

*(Port 8080 is intentionally avoided to ensure compatibility with Jenkins).*

---

## 🧪 Running the Test Suite

```bash
python -m unittest discover tests
```
Runs all 14 unit and integration tests verifying tax formulas, marginal relief, and API endpoints.

---

## 📁 Project Architecture

```
ctc/
├── app.py                      # FastAPI application & REST endpoints
├── run.py                      # Server runner (Port 5000 default)
├── engine/
│   ├── calculator.py           # Core salary & TY 2026-27 tax computation engine
│   ├── comparator.py           # Offer Clash (A vs B) comparison logic
│   └── government.py           # 7th CPC central government pay rules & comparator
├── data/
│   ├── ctc_compass_unified.json# Pre-joined, consolidated data store (150 companies)
│   ├── DATASET_OVERVIEW.md     # Authoritative dataset documentation & metrics
│   ├── companies_master.csv    # 150 unique tech companies
│   ├── compensation_observations_master.csv # 126 verified salary observations
│   ├── campus_company_crosswalk.csv         # Campus recruitment benchmarks
│   ├── government_posts_master.csv          # 11 deduplicated 7th CPC posts
│   ├── government_pay_rules_master.csv      # 8 statutory pay rules
│   ├── tax_payroll_rules_master.csv         # 20 statutory tax & payroll rules
│   └── sources_master.csv                   # 111 audited source references
├── static/
│   ├── index.html              # Responsive single-page application UI
│   ├── app.js                  # Frontend logic, charts, and interactive calculators
│   └── styles.css              # Custom styling & animations
└── tests/
    ├── test_calculator.py      # Unit tests for tax slabs, marginal relief & pay slips
    └── test_api.py             # Integration tests for FastAPI endpoints
```

