# CTC Compass India 🧭

> **Decode Pay. Compare Offers. Know Your Worth.**  
> A transparent salary deconstruction, taxation, and career compensation intelligence engine for Indian tech graduates, working engineers, and public-sector aspirants.

---

## 🌟 Key Capabilities

### 1. The CTC Reality Deconstructor
- Dissects headline CTC (e.g. "12 LPA") into actual guaranteed monthly in-hand cash vs employer overheads (Employer PF, Gratuity, Health Insurance).
- **The 5-Step Visual Pipeline:** Clear visual roadmap showing how headline numbers become bank deposits.
- **FY 2026–27 Statutory Tax Engine:**
  - Implements the **Income-tax Act, 2025** and **Finance Act, 2026** default 7-slab progressive regime.
  - ₹75,000 Standard Deduction.
  - Section 156(2) full rebate up to ₹60,000 (**₹0 Tax on salaries up to ₹12.75 LPA**).
  - Statutory Marginal Relief & Section 288B rounding to nearest ₹10.
- **Over 35 Categorized Presets:** One-click preloading for TCS Ninja/Digital/Prime, Infosys SE/DSE/SP, Wipro Elite/Turbo, Cognizant, Accenture, Zoho, Swiggy, Zomato, Flipkart, Meesho, Razorpay, PhonePe, Cisco, Oracle, Qualcomm, Adobe, Salesforce, Microsoft, Amazon, Google, Uber, Atlassian, Broadcom, Morgan Stanley, Goldman Sachs, D. E. Shaw.
- **Quick-Select CTC Pills:** One-tap calculation for ₹3.6L, ₹6.5L, ₹10L, ₹12L, ₹15L, ₹20L, ₹30L, and ₹45L.

### 2. Offer Clash (A vs B Duel)
- Head-to-head comparison between two competing job offers (e.g. High-variable startup vs High-fixed MNC).
- Generates net cash flow differences, Year 2 cliff analysis (highlighting joining bonus traps), risk index, and actionable recommendations.

### 3. Tech vs Public Sector (Private IT vs Central Govt & PSUs)
- Comprehensive comparison across **19 elite public-sector profiles**:
  - **All India Services (UPSC CSE):** IAS (Sub-Divisional Magistrate), IPS (Assistant Superintendent of Police), IFS (Diplomat with USD Foreign Allowance).
  - **Scientific & Research:** ISRO Scientist / Engineer 'SC', DRDO Scientist 'B'.
  - **Banking & Regulators:** RBI Grade B Manager (₹32L CTC eq.), SEBI Grade A Officer (₹34L CTC eq.), SBI Probationary Officer (₹18L CTC eq.).
  - **Maharatna PSUs:** ONGC Executive Engineer (₹24L CTC eq.), IOCL Engineer (₹21L CTC eq.), NTPC Executive Trainee.
  - **SSC CGL Executive Posts:** Income Tax Inspector, ASO in MEA (Foreign Postings), ASO in CSS, CBI Sub-Inspector (25% Special Allowance), CAG Assistant Audit Officer (Level 8), Divisional Accountant.
  - **Indian Railways:** Station Master (Level 6).
- Models real government earnings: **Basic Pay + Dearness Allowance (DA 50%+) + HRA / Leased Flat + Transport Allowance + 14% Government Matching NPS + Official Perks (Bungalow, SUV, Security, Lifetime CGHS)**.

### 4. Verified Tech Salary & Campus Explorer
- Pure verified directory of **85 verified tech employers** (unlisted companies without salary data have been purged).
- Detailed role cards with experience tracks (SDE-1, SDE-2, MTS), component breakdowns, campus benchmarks, and direct links to official careers portals.

### 5. Plain English Glossary
- Jargon-free breakdowns explaining **Basic Pay**, **HRA**, **Special Allowance**, **Employer vs Employee PF**, **Gratuity (5-year rule)**, and **TDS**.

---

## 🚀 Running the Web Application

### Prerequisites
- Python 3.10+
- Installed packages: `fastapi`, `uvicorn`, `pydantic`, `httpx`

```bash
python run.py 5000
```

Open your browser at:  
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

*(Port 8080 is intentionally avoided to preserve Jenkins compatibility).*

---

## 🧪 Automated Testing

```bash
python -m unittest discover tests
```
Runs the full suite of unit and integration tests verifying tax formulas, marginal relief, and API endpoints.

---

## 📁 Project Architecture

```
ctc/
├── app.py                      # FastAPI application & REST endpoints
├── run.py                      # Server runner (default: Port 5000)
├── README.md                   # Full documentation & setup
├── engine/
│   ├── calculator.py           # Core CTC deconstruction & statutory tax engine
│   ├── comparator.py           # Offer Clash (A vs B) comparison logic
│   └── government.py           # Public sector, PSU & civil service pay engine
├── data/
│   ├── ctc_compass_unified.json# Pre-joined, consolidated data store (85 companies, 19 gov profiles)
│   ├── DATASET_OVERVIEW.md     # Authoritative dataset documentation & metrics
│   ├── companies_master.csv    # Canonical tech companies
│   ├── compensation_observations_master.csv # Deduplicated salary observations
│   ├── campus_company_crosswalk.csv         # Campus recruitment benchmarks
│   ├── government_posts_master.csv          # 7th CPC central posts
│   ├── government_pay_rules_master.csv      # Statutory pay rules
│   ├── tax_payroll_rules_master.csv         # Statutory tax & payroll rules
│   ├── sources_master.csv                   # Audited source references
│   └── calculation_spec_draft.md            # Tax Year 2026-27 calculation specs
├── static/
│   ├── index.html              # Responsive single-page application UI
│   ├── app.js                  # Frontend logic, charts, and interactive calculators
│   └── styles.css              # Custom styling & animations
└── tests/
    ├── test_calculator.py      # Unit tests for tax slabs, marginal relief & pay slips
    └── test_api.py             # Integration tests for FastAPI endpoints
```
