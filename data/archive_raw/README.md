# CTC Compass — Final India compensation research bundle

Research cut-off: 29 October 2026.

## Contents
- `companies_master.csv`: 150 company records.
- `compensation_observations_master.csv`: 126 compensation observations, including 35 additional observations derived from public Reddit / LeetCode Discuss posts and compensation threads.
- `social_media_compensation_observations.csv`: the 35 social-post observations only.
- `sources_master.csv`: source register, deduplicated by source URL where available.
- `campus_company_crosswalk.csv`: supplied campus-company names mapped to canonical employer records; user-provided campus CTC values are labelled unverified.
- `government_posts_master.csv`, `government_pay_rules_master.csv`, `tax_payroll_rules_master.csv`: previously assembled government and tax research tables.
- `calculation_spec_draft.md`: draft salary/tax calculation specification; not a production-ready tax engine.
- `social_research_QA_summary.md`: research scope, caveats and interpretation rules.

## Critical interpretation notes
- All structured compensation observations refer to India-based roles.
- Community posts are self-reported and not independently verified. A post can be inaccurate, edited, deleted, duplicated, or copied by another account.
- Annual CTC, base/fixed salary, first-year cash, joining/retention bonuses, employer PF/gratuity and equity are different measures. Use `amount_basis` and `evidence_notes` before comparing observations.
- Some social-post values are estimates by the author and depend on stock price, USD/INR conversion and vesting schedule.
- Campus CTC supplied by the user is not treated as independently verified.
- Public X/Twitter search did not yield enough indexable, attributable India CTC breakdowns to include. No X datapoints were fabricated.
- No independently verifiable India salary breakdown was found for every campus employer; missing values remain unknown, not zero.
