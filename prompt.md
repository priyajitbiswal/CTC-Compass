# Research Project: CTC Compass India — Verified Indian Salary Structures, Taxation, and Government Compensation

## 1. Your Role

Act as a senior Indian compensation researcher, payroll specialist, tax researcher, and data analyst. Conduct rigorous, source-backed research to build a structured dataset for a web application called **CTC Compass India**.

The application will help Indian students, fresh graduates, job seekers, and working professionals understand:

- How their CTC is structured.
- How much of their CTC they will actually receive as monthly take-home salary.
- How income tax differs under the old and new tax regimes.
- How compensation differs across Indian IT companies, roles, experience levels, and locations.
- How government employee salaries are calculated under applicable pay rules.
- How two job offers compare after accounting for taxes, deductions, benefits, and variable compensation.

The goal is accurate, verifiable research that can be converted into a database and used by a Java/Spring Boot application. Do not prioritize producing a large number of records over data quality.

## 2. Research Standards — Mandatory

Follow these rules throughout the research.

1. **Never fabricate data.** Do not invent salary components, percentages, pay ranges, tax rules, government allowances, company policies, source URLs, or publication dates.

2. **Use primary sources whenever possible.** Prioritize:
   - Official company career pages and job advertisements.
   - Company annual reports and official remuneration disclosures.
   - Official recruitment notifications and offer/pay documentation that is publicly accessible.
   - Income Tax Department of India.
   - Ministry of Finance and Department of Expenditure.
   - Ministry of Labour and Employment, EPFO, and other relevant statutory authorities.
   - Official state government pay rules and notifications.
   - Official public-sector undertaking recruitment notifications.

3. **Use secondary sources only where primary sources are insufficient.** These may include reputable salary databases, employee-reported compensation platforms, placement reports, and credible journalism. Clearly identify self-reported data.

4. **Verify every material claim.** Include the direct source URL, source title, publisher, relevant publication or update date, access date, and the specific claim supported by the source.

5. **Do not mistake CTC for base salary or take-home salary.** Keep these concepts separate.

6. **Do not generalize an individual offer to an entire company.** A compensation package for one role, level, location, hiring year, or employee is not necessarily the company's standard structure.

7. **Do not present estimates as verified facts.** Explicitly classify every record as official, independently corroborated, employee-reported, inferred, or unknown.

8. **If information cannot be found, state that it is unavailable.** Do not fill missing values with industry averages unless those values are explicitly marked as estimates and supported by a defensible methodology.

9. **Separate tax-law facts from assumptions about salary structure.** Cite the law or official guidance applicable to the relevant financial year or tax year.

## 3. Scope A: Research 100 Major IT Companies in India

Build a research list of 100 major IT and technology employers operating in India.

Include a balanced mix of:
- Large Indian IT services companies.
- Global IT services and consulting companies with Indian operations.
- Product-based technology companies.
- Cloud and enterprise software companies.
- Semiconductor and embedded-systems companies.
- Major technology-focused employers that recruit Indian graduates.

Examples of companies to investigate include TCS, Infosys, Wipro, HCLTech, Tech Mahindra, LTIMindtree, Cognizant, Accenture, Capgemini, IBM, Deloitte, Oracle, Microsoft, Google, Amazon, SAP, Cisco, Adobe, Qualcomm, Intel, and other relevant employers.

This list is illustrative, not a claim that these are the 20 highest-paying or largest employers. Define a transparent selection methodology for the final list of 100. Do not invent a ranking. If a defensible ranking is unavailable, label the list as a curated set of major employers rather than a ranked top 100.

For every company, research the following:

### Company profile
- Company name.
- Official website.
- Indian operating entity, where identifiable from public sources.
- Major Indian hiring locations.
- Industry category.
- Official careers page.
- Evidence that the company operates or recruits in India.
- Source URLs and verification date.

### Compensation information
Search for public compensation information across relevant roles and experience levels, especially entry-level positions.

Investigate, where evidence exists:
- Graduate engineer and software engineer roles.
- Associate software engineer and analyst roles.
- Senior software engineer roles.
- Experienced engineering roles.
- Other relevant technology positions.
- Internship compensation only where clearly distinguishable from full-time compensation.

For each salary observation, capture:
- Company.
- Job title.
- Experience level.
- Employment type.
- Hiring year or observation period.
- Work location, if available.
- Annual CTC or total compensation.
- Base salary.
- Fixed cash compensation.
- Variable pay or performance bonus.
- Joining bonus.
- Retention bonus.
- Employer provident fund contribution.
- Gratuity included in CTC.
- Equity or stock-based compensation.
- Insurance and other benefits.
- Any other explicitly documented salary component.
- Currency and reporting period.
- Whether the figure is an advertised range, an actual offer, an employee-reported observation, or an aggregate statistic.
- Sample size, if available.
- Source URL.
- Source publication or observation date.
- Confidence level and evidence notes.

Do not assume that every component will be disclosed. Use null or "unknown" when the information is missing.

### Important research requirement

A company may publish its revenue, employee costs, executive remuneration, or aggregate personnel expenses without publishing its standard employee salary structure. Do not use these aggregate figures to infer the precise CTC breakdown of a fresher.

Likewise, do not treat a job posting's maximum advertised compensation as a typical salary.

## 4. Scope B: Build Company-Specific Compensation Profiles

Determine whether public evidence supports a reusable compensation profile for each company, role, and experience level.

A profile may contain:
- Observed CTC range.
- Observed base salary range.
- Known fixed and variable components.
- Known employer contributions.
- Commonly reported benefits.
- Typical hiring locations.
- Applicable salary structure documentation.
- Evidence count and observation dates.
- Confidence rating.

Create separate profiles when compensation differs materially by:
- Role.
- Experience level.
- Hiring program.
- Location.
- Business unit.
- Compensation year.

Do not force one breakdown to represent every employee at the company.

If exact component-level data is unavailable, provide only the fields supported by evidence and explain what additional information is needed from an actual offer letter.

## 5. Scope C: Research Indian Income Tax and Payroll Rules

Research the official Indian tax and payroll rules required to calculate take-home salary.

Verify the relevant provisions for the current period as of the research date. Cover at least the current applicable tax year and, where practical, the preceding tax year for comparison.

Investigate the following:

### Income tax
- Old-regime income tax slabs.
- New-regime income tax slabs.
- Rebate eligibility and limits.
- Marginal relief, where applicable.
- Health and education cess.
- Surcharge and marginal relief, where relevant.
- Standard deduction.
- HRA exemption rules.
- Section 80C deductions.
- Section 80D deductions.
- Other significant deductions or exemptions.
- Tax treatment of salary, bonuses, perquisites, and employer contributions.
- Tax treatment of equity compensation where relevant.
- TDS calculations and the distinction between TDS and final tax liability.

For each rule, capture:
- Rule name.
- Applicable tax year or assessment year.
- Relevant section or provision.
- Exact calculation method or formula.
- Eligibility conditions.
- Thresholds and limits.
- Exceptions.
- Official source URL.
- Date verified.
- Whether the rule is statutory, an official administrative explanation, or an interpretation requiring professional review.

Do not assume that a deduction available under one regime is available under the other.

Pay special attention to changes in Indian tax legislation, including the transition to the Income-tax Act, 2025, and the applicable terminology and rules for Tax Year 2026–27 onward. Verify the effective dates and transitional provisions using official sources. Do not copy outdated references without checking whether they still apply.

### Payroll and statutory deductions
Research:
- Employee and employer EPF contributions.
- Applicable contribution rates and wage ceilings.
- Conditions affecting PF contribution calculations.
- Gratuity eligibility and statutory calculation.
- Professional tax by state, where applicable.
- Employee pension contributions, where applicable.
- NPS treatment for private-sector employees.
- Other significant mandatory or common payroll deductions.
- Applicable labour-code provisions and their commencement status.

Distinguish statutory obligations from common employer practices. Do not assume all employees or employers are subject to identical contribution calculations.

For each provision, identify the relevant source, applicability conditions, effective date, and calculation methodology.

## 6. Scope D: Research Government Jobs in India

Build a separate structured dataset for government employment. Do not mix government pay scales with private-sector CTC profiles.

Cover these categories where official information is available:

1. Central government civil services and departments.
2. SSC recruitment posts.
3. Railway recruitment posts.
4. Banking recruitment, distinguishing public-sector banks from central government employment.
5. Public-sector undertakings (PSUs).
6. Selected state government jobs, with each state treated separately.

For each recruitment post or salary profile, collect:
- Recruiting organization.
- Post name.
- Cadre or service, if applicable.
- Official recruitment notification URL.
- Notification date and applicable recruitment year.
- Pay level or grade.
- Pay matrix or pay scale.
- Entry basic pay.
- Relevant pay progression rules.
- Dearness allowance rate and effective date.
- House rent allowance rates and conditions.
- Transport allowance and conditions.
- Other applicable allowances.
- Employee NPS or pension-related deductions.
- Employee PF or other statutory contributions, where applicable.
- Professional tax, where applicable.
- Income tax treatment.
- Location-dependent differences.
- Probation or training-period pay, if different.
- Eligibility and service-rule conditions.
- Source URL for every important component.

Use the correct official pay rules for the particular organization, cadre, state, and period.

### Government salary calculation methodology

For each profile, show how the following would be calculated:
- Monthly gross cash salary.
- Annual gross cash salary.
- Employer retirement contributions or other benefits, where applicable.
- Annual compensation, if a defensible total-compensation figure can be calculated.
- Estimated income tax.
- Employee statutory deductions.
- Monthly net take-home pay.

Clearly distinguish gross cash salary from total compensation. Do not label a government employee's gross pay as CTC unless the definition and included benefits are explicitly explained.

Do not use a central government pay matrix as a substitute for state government pay rules or PSU-specific compensation policies.

## 7. Scope E: Build a Salary Calculation Specification

Translate the research into an implementable calculation specification.

The application will eventually accept:
- Employment category.
- Company or recruiting organization.
- Job title or post.
- Experience level or pay level.
- Work location.
- Annual CTC or known pay components.
- Fixed and variable compensation.
- Salary structure details, when known.
- Tax regime.
- Relevant deductions and exemptions.
- Applicable tax year.

The output should include:
- Annual CTC, where applicable.
- Annual fixed cash salary.
- Variable pay.
- Employer contributions.
- Estimated monthly gross cash salary.
- Employee deductions.
- Estimated annual taxable income.
- Estimated annual income tax.
- Estimated monthly TDS.
- Estimated monthly take-home pay.
- Annual take-home pay.
- Tax and deduction breakdown.
- Explanation of assumptions and missing information.

Specify the formulas, inputs, dependencies, rounding rules, and edge cases.

Do not claim exact take-home pay when material salary components are unknown. In such cases, return a range or an explicitly assumption-based estimate.

Create separate calculation paths for:
1. Company profile-based estimates.
2. User-entered offer-letter calculations.
3. Government pay-scale calculations.

The actual statutory tax calculations should use official tax rules, not salary averages collected from employers.

## 8. Scope F: Create a Structured Data Model

Design a database schema suitable for PostgreSQL or SQLite, with the possibility of using it in a Java/Spring Boot REST API.

At minimum, propose tables or equivalent entities for:

- Companies.
- Job roles.
- Compensation observations.
- Compensation components.
- Salary profiles.
- Government organizations.
- Government posts and pay levels.
- Pay rules and allowances.
- Tax rules.
- Sources and citations.
- Data verification history.
- User-submitted compensation observations, if legally and technically appropriate.

For each entity, define:
- Field name.
- Data type.
- Required or optional status.
- Meaning.
- Validation rules.
- Relationships and unique constraints.

Every salary observation and every material rule should be traceable to one or more sources.

Store effective dates and source dates. Do not overwrite historical rules when new tax rates or salary policies are published.

## 9. Required Deliverables

Produce the following outputs.

### Deliverable A: Research report
A concise but comprehensive report explaining:
- What information is publicly available.
- Which companies have verified compensation information.
- What salary-component details are generally missing.
- How government salary information differs from private-sector information.
- Key tax and payroll rules.
- Data limitations and legal considerations.
- Recommended data collection strategy.

### Deliverable B: Company master dataset
A list of 100 major IT and technology employers in India, with official company and careers-page references.

Do not falsely imply that each company has a verified salary breakdown.

### Deliverable C: Compensation observations dataset
A structured dataset of actual sourced observations, with as many high-quality records as research permits.

Prioritize depth for the most useful companies and roles over shallow, unsupported coverage of all 100 companies.

### Deliverable D: Government salary dataset
A structured set of government recruitment posts and pay profiles with official source references.

### Deliverable E: Tax and payroll rules dataset
A versioned set of applicable tax and payroll rules, calculation formulas, effective dates, and official citations.

### Deliverable F: Calculation specification
Pseudocode or language-neutral formulas that can be implemented in Java.

Include example calculations with clearly stated assumptions. Independently validate the arithmetic and cite the rules used.

### Deliverable G: Database-ready files
Export research results to CSV or JSON. Prefer separate files:
- companies.csv
- compensation_observations.csv
- compensation_components.csv
- government_posts.csv
- government_pay_rules.csv
- tax_rules.csv
- sources.csv

Include a data dictionary and a README explaining fields, provenance, confidence classifications, null values, and known limitations.

Use stable identifiers to connect records across files. Ensure that the output can be imported into a relational database without manual reconstruction.

If file creation is supported, provide downloadable files. If a complete dataset cannot fit in one response, produce it in clearly numbered batches and maintain a consistent schema.

### Deliverable H: Data quality audit
Provide:
- Number of companies researched.
- Number with official compensation information.
- Number with credible secondary compensation observations.
- Number with component-level breakdowns.
- Number of government posts with official pay information.
- Number of tax/payroll rules verified against official sources.
- Number of records with missing material fields.
- Records needing further verification.
- Conflicting sources and how the conflicts were handled.

Do not inflate these counts.

## 10. Quality Assurance

Before finalizing:
- Check that all URLs correspond to the claims cited.
- Check that salary units and reporting periods are consistent.
- Distinguish monthly from annual figures.
- Distinguish base salary, fixed cash, CTC, gross salary, and take-home pay.
- Identify whether equity values are annualized, vested, granted, or merely advertised.
- Check that government allowances use the correct effective dates and eligibility conditions.
- Check that tax rules are versioned correctly.
- Check calculations independently.
- Flag stale, conflicting, or weakly sourced data.
- Never fill a missing value with zero unless zero is explicitly documented.
- Do not silently convert an assumption into a fact.

## 11. Research Execution Plan

Execute the work in stages to maintain quality:

**Stage 1:** Establish the research date, applicable tax-year framework, source hierarchy, and database schema.

**Stage 2:** Build the company master list and verify official company identities and careers pages.

**Stage 3:** Collect compensation observations, beginning with the most relevant large IT employers and entry-level technology roles. Expand to 100 companies without fabricating missing data.

**Stage 4:** Research official government recruitment notifications, pay matrices, allowances, and statutory deductions.

**Stage 5:** Compile and version tax and payroll rules using official sources.

**Stage 6:** Define and validate calculation formulas and sample outputs.

**Stage 7:** Export the database-ready files and run the data-quality audit.

At each stage, preserve provenance and clearly identify incomplete work. If the research scope exceeds your available time, output the completed stages and a precise list of remaining work instead of pretending that everything has been verified.

## Final Instruction

Begin by stating the current research date and establishing the applicable Indian tax-year framework. Then proceed with source-backed research.

The final objective is a trustworthy, maintainable salary-information dataset for an Indian salary calculator—not a speculative list of company salary percentages. Accuracy, traceability, effective dates, and explicit uncertainty take precedence over coverage.