/**
 * CTC Compass India — Modern Interactive Frontend Application
 * v3.0 (Enriched & Plain-English Redesign)
 */

// Application State
const state = {
  currentTab: 'calculator',
  currentTaxRegime: 'new',
  companies: [],
  filteredCompanies: [],
  govProfiles: [],
  breakdownChart: null,
  clashChart: null,
  companyPresets: {
    // Campus IT Services
    'TCS_NINJA': { ctc: 336877, basic: 40, variable: 5, joining: 0, equity: 0 },
    'TCS_DIGITAL': { ctc: 700000, basic: 40, variable: 8, joining: 0, equity: 0 },
    'TCS_PRIME': { ctc: 900000, basic: 40, variable: 10, joining: 0, equity: 0 },
    'INFY_SE': { ctc: 360000, basic: 40, variable: 5, joining: 0, equity: 0 },
    'INFY_DSE': { ctc: 650000, basic: 40, variable: 8, joining: 0, equity: 0 },
    'INFY_SP': { ctc: 950000, basic: 40, variable: 10, joining: 0, equity: 0 },
    'WIPRO_ELITE': { ctc: 350004, basic: 40, variable: 5, joining: 0, equity: 0 },
    'WIPRO_TURBO': { ctc: 650000, basic: 40, variable: 8, joining: 0, equity: 0 },
    'CTSH_GENC': { ctc: 401988, basic: 40, variable: 5, joining: 0, equity: 0 },
    'CTSH_ELEVATE': { ctc: 600000, basic: 40, variable: 8, joining: 0, equity: 0 },
    'ACN_ASE': { ctc: 450000, basic: 42, variable: 8, joining: 25000, equity: 0 },
    'ACN_FSE': { ctc: 650000, basic: 42, variable: 8, joining: 50000, equity: 0 },
    'HCL_ASCEND': { ctc: 375000, basic: 40, variable: 5, joining: 0, equity: 0 },

    // Indian Unicorns & Product
    'ZOHO': { ctc: 850000, basic: 45, variable: 0, joining: 0, equity: 0 },
    'FOODHUB': { ctc: 1400000, basic: 45, variable: 10, joining: 100000, equity: 0 },
    'HYPERVERGE': { ctc: 1650000, basic: 40, variable: 10, joining: 150000, equity: 100000 },
    'FUTURES_FIRST': { ctc: 1890000, basic: 40, variable: 25, joining: 200000, equity: 0 },
    'SWIGGY': { ctc: 2200000, basic: 40, variable: 10, joining: 200000, equity: 500000 },
    'ZOMATO': { ctc: 2200000, basic: 40, variable: 10, joining: 200000, equity: 450000 },
    'FLIPKART': { ctc: 2600000, basic: 40, variable: 10, joining: 300000, equity: 600000 },
    'MEESHO': { ctc: 2600000, basic: 50, variable: 8, joining: 200000, equity: 500000 },
    'RAZORPAY': { ctc: 2400000, basic: 40, variable: 10, joining: 200000, equity: 600000 },
    'PHONEPE': { ctc: 2600000, basic: 40, variable: 10, joining: 250000, equity: 800000 },

    // Global Tech Giants
    'CISCO': { ctc: 1800000, basic: 40, variable: 10, joining: 200000, equity: 300000 },
    'ORACLE': { ctc: 2000000, basic: 40, variable: 8, joining: 200000, equity: 400000 },
    'QUALCOMM': { ctc: 2060000, basic: 40, variable: 12, joining: 250000, equity: 300000 },
    'ADOBE': { ctc: 2800000, basic: 40, variable: 12, joining: 300000, equity: 800000 },
    'SALESFORCE': { ctc: 3000000, basic: 40, variable: 10, joining: 300000, equity: 900000 },
    'MICROSOFT': { ctc: 3200000, basic: 40, variable: 10, joining: 500000, equity: 850000 },
    'AMAZON': { ctc: 3400000, basic: 40, variable: 0, joining: 750000, equity: 300000 },
    'GOOGLE': { ctc: 3500000, basic: 45, variable: 15, joining: 400000, equity: 1000000 },
    'UBER': { ctc: 4200000, basic: 45, variable: 12, joining: 500000, equity: 1200000 },
    'ATLASSIAN': { ctc: 3800000, basic: 50, variable: 8, joining: 400000, equity: 1200000 },
    'BROADCOM': { ctc: 4227681, basic: 45, variable: 15, joining: 400000, equity: 1400000 },

    // Finance & Quant
    'MS': { ctc: 2300000, basic: 45, variable: 15, joining: 250000, equity: 0 },
    'GS': { ctc: 2600000, basic: 45, variable: 20, joining: 300000, equity: 0 },
    'DESHAW': { ctc: 5000000, basic: 45, variable: 25, joining: 600000, equity: 800000 }
  }
};

// Utilities
const formatINR = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
};

const formatLakhs = (val) => {
  const lpa = (val / 100000).toFixed(2);
  return `${lpa} LPA`;
};

// Navigation
function switchTab(tabId) {
  state.currentTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  if (tabId === 'clash') {
    runOfferClash();
  } else if (tabId === 'sarkari') {
    runGovtComparison();
  } else if (tabId === 'explorer' && state.companies.length === 0) {
    loadExplorerCompanies();
  }

  lucide.createIcons();
}

// ========================================================
// TAB 1: CTC REALITY DECONSTRUCTOR
// ========================================================
function handleCtcInputChange(val) {
  const ctc = parseFloat(val) || 0;
  const slider = document.getElementById('slider-ctc');
  if (slider) slider.value = Math.min(ctc, 5000000);
  document.getElementById('label-ctc-lakhs').innerText = formatLakhs(ctc);
  updateCalculation();
}

function handleCtcSliderChange(val) {
  const ctc = parseFloat(val) || 0;
  document.getElementById('input-ctc').value = ctc;
  document.getElementById('label-ctc-lakhs').innerText = formatLakhs(ctc);
  updateCalculation();
}

function setQuickCtc(amount) {
  document.getElementById('input-ctc').value = amount;
  document.getElementById('slider-ctc').value = Math.min(amount, 5000000);
  document.getElementById('label-ctc-lakhs').innerText = formatLakhs(amount);
  updateCalculation();
}

function setTaxRegime(regime) {
  state.currentTaxRegime = regime;
  const btnNew = document.getElementById('btn-regime-new');
  const btnOld = document.getElementById('btn-regime-old');
  if (regime === 'new') {
    btnNew.className = 'px-2.5 py-1 text-xs font-semibold rounded-md bg-brand-600 text-white';
    btnOld.className = 'px-2.5 py-1 text-xs font-semibold rounded-md text-slate-400 hover:text-white';
  } else {
    btnOld.className = 'px-2.5 py-1 text-xs font-semibold rounded-md bg-brand-600 text-white';
    btnNew.className = 'px-2.5 py-1 text-xs font-semibold rounded-md text-slate-400 hover:text-white';
  }
  updateCalculation();
}

function loadCalculatorPreset(key) {
  if (!key || !state.companyPresets[key]) return;
  const p = state.companyPresets[key];
  document.getElementById('input-ctc').value = p.ctc;
  document.getElementById('slider-ctc').value = Math.min(p.ctc, 5000000);
  document.getElementById('label-ctc-lakhs').innerText = formatLakhs(p.ctc);
  document.getElementById('slider-basic').value = p.basic;
  document.getElementById('slider-variable').value = p.variable;
  document.getElementById('input-joining').value = p.joining;
  document.getElementById('input-equity').value = p.equity;
  updateCalculation();
}

function resetCalculatorDefaults() {
  document.getElementById('calc-preset-select').value = '';
  setQuickCtc(1200000);
  document.getElementById('slider-basic').value = 40;
  document.getElementById('slider-variable').value = 10;
  document.getElementById('input-joining').value = 0;
  document.getElementById('input-equity').value = 0;
  document.getElementById('check-epf-cap').checked = true;
  document.getElementById('check-gratuity').checked = true;
  setTaxRegime('new');
}

async function updateCalculation() {
  const ctc = parseFloat(document.getElementById('input-ctc').value) || 0;
  const basicPct = parseFloat(document.getElementById('slider-basic').value) || 40;
  const variablePct = parseFloat(document.getElementById('slider-variable').value) || 10;
  const joining = parseFloat(document.getElementById('input-joining').value) || 0;
  const equity = parseFloat(document.getElementById('input-equity').value) || 0;
  const capEpf = document.getElementById('check-epf-cap').checked;
  const includeGratuity = document.getElementById('check-gratuity').checked;

  document.getElementById('label-basic-pct').innerText = `${basicPct}%`;
  document.getElementById('label-variable-pct').innerText = `${variablePct}%`;

  const payload = {
    annual_ctc: ctc,
    basic_pct: basicPct,
    variable_pct: variablePct,
    joining_bonus: joining,
    retention_bonus: 0,
    annual_equity: equity,
    cap_epf_at_statutory_ceiling: capEpf,
    include_gratuity: includeGratuity,
    tax_regime: state.currentTaxRegime
  };

  try {
    const res = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Calculation request failed');
    const data = await res.json();
    renderCalculatorOutputs(data);
  } catch (err) {
    console.error('Calculation error:', err);
  }
}

function renderCalculatorOutputs(data) {
  const slip = data.monthly_pay_slip;
  const annual = data.annual_cash_summary;
  const tax = data.tax_calculation;
  const metrics = data.metrics;
  const employer = data.employer_deductions;

  // 1. Pipeline Steps
  document.getElementById('pipe-ctc').innerText = formatINR(data.headline_ctc);
  document.getElementById('pipe-employer').innerText = `-${formatINR(employer.total)}`;
  document.getElementById('pipe-gross').innerText = formatINR(annual.year1_gross_cash);
  const employeeDeductionsAnnual = employer.employer_epf + 2400 + tax.total_annual_tax;
  document.getElementById('pipe-deductions').innerText = `-${formatINR(employeeDeductionsAnnual)}`;
  document.getElementById('pipe-inhand').innerText = `${formatINR(slip.monthly_fixed_in_hand)}/mo`;

  // 2. Big Highlight Metrics
  document.getElementById('metric-monthly-inhand').innerText = formatINR(slip.monthly_fixed_in_hand);
  document.getElementById('metric-realization-rate').innerText = `${metrics.cash_realization_rate_pct}%`;
  document.getElementById('plain-english-verdict').innerHTML = `
    For every ₹100 in this offer, you take home <strong class="text-emerald-400">₹${metrics.cash_realization_rate_pct} in liquid cash</strong>. 
    ₹${((employer.total / data.headline_ctc) * 100).toFixed(1)} goes to employer overheads & PF, and ₹${tax.effective_tax_rate} goes to Income Tax.
  `;

  // Year 2 Warning
  document.getElementById('metric-y2-annual').innerText = `${formatINR(annual.year2_net_in_hand)} / year (${formatINR(annual.year2_monthly_in_hand)}/mo)`;

  // 3. Secondary Chips
  document.getElementById('metric-annual-inhand').innerText = formatINR(annual.year1_net_in_hand);
  document.getElementById('metric-annual-tax').innerText = formatINR(tax.total_annual_tax);
  document.getElementById('metric-effective-tax').innerText = `${tax.effective_tax_rate}% effective tax`;
  document.getElementById('metric-employer-overhead').innerText = formatINR(employer.total);

  // 4. Monthly Salary Slip Table
  document.getElementById('slip-basic').innerText = formatINR(slip.breakdown.basic_pay);
  document.getElementById('slip-hra').innerText = formatINR(slip.breakdown.hra);
  document.getElementById('slip-special').innerText = formatINR(slip.breakdown.special_allowance);
  document.getElementById('slip-gross').innerText = formatINR(slip.fixed_gross);

  document.getElementById('slip-pf').innerText = formatINR(slip.deductions.employee_pf);
  document.getElementById('slip-pt').innerText = formatINR(slip.deductions.professional_tax);
  document.getElementById('slip-tds').innerText = formatINR(slip.deductions.income_tax_tds);
  document.getElementById('slip-deductions-total').innerText = formatINR(slip.deductions.total_deductions);

  // 5. Footnotes
  document.getElementById('note-employer-pf').innerText = formatINR(employer.employer_epf) + '/yr';
  document.getElementById('note-gratuity').innerText = formatINR(employer.gratuity) + '/yr';

  // 6. Visual Breakdown Chart
  document.getElementById('chart-ctc-label').innerText = `${formatLakhs(data.headline_ctc)} Breakdown`;
  renderBreakdownChart(data);
}

function renderBreakdownChart(data) {
  const ctx = document.getElementById('ctcBreakdownChart').getContext('2d');
  
  const inHandAnnual = data.annual_cash_summary.year1_net_in_hand;
  const taxAnnual = data.tax_calculation.total_annual_tax;
  const employeeDeductions = (data.employer_deductions.employer_epf) + 2400;
  const employerOverheads = data.employer_deductions.total;
  const variablePay = data.ctc_summary.variable_cash_annual;
  const equity = data.ctc_summary.equity_annual_vest;

  const chartData = {
    labels: ['Guaranteed Net Cash', 'Variable Bonus', 'Stocks / ESOPs', 'Income Tax (TDS)', 'Employee PF & PT', 'Employer Overheads'],
    datasets: [{
      data: [inHandAnnual, variablePay, equity, taxAnnual, employeeDeductions, employerOverheads],
      backgroundColor: [
        '#10b981', // Emerald - Net cash
        '#f59e0b', // Amber - Variable
        '#8b5cf6', // Violet - Equity
        '#f43f5e', // Rose - Tax
        '#64748b', // Slate - EPF/PT
        '#334155'  // Dark slate - Employer overhead
      ],
      borderWidth: 0
    }]
  };

  if (state.breakdownChart) {
    state.breakdownChart.destroy();
  }

  state.breakdownChart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#cbd5e1',
            font: { family: 'Plus Jakarta Sans', size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${context.label}: ${formatINR(val)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

// ========================================================
// TAB 2: OFFER CLASH (A vs B DUEL)
// ========================================================
async function runOfferClash() {
  const offerA = {
    name: document.getElementById('clash-a-name').value || 'Offer A',
    ctc: parseFloat(document.getElementById('clash-a-ctc').value) || 0,
    variable_pct: parseFloat(document.getElementById('clash-a-var').value) || 0,
    joining_bonus: parseFloat(document.getElementById('clash-a-bonus').value) || 0,
    annual_equity: parseFloat(document.getElementById('clash-a-stock').value) || 0
  };

  const offerB = {
    name: document.getElementById('clash-b-name').value || 'Offer B',
    ctc: parseFloat(document.getElementById('clash-b-ctc').value) || 0,
    variable_pct: parseFloat(document.getElementById('clash-b-var').value) || 0,
    joining_bonus: parseFloat(document.getElementById('clash-b-bonus').value) || 0,
    annual_equity: parseFloat(document.getElementById('clash-b-stock').value) || 0
  };

  try {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_a: offerA, offer_b: offerB })
    });
    if (!res.ok) throw new Error('Offer clash request failed');
    const data = await res.json();
    renderOfferClashResults(data);
  } catch (err) {
    console.error('Offer clash error:', err);
  }
}

function renderOfferClashResults(data) {
  const comp = data.comparison;
  const a = data.offer_a;
  const b = data.offer_b;

  document.getElementById('clash-table-header-a').innerText = a.name;
  document.getElementById('clash-table-header-b').innerText = b.name;

  document.getElementById('clash-verdict-title').innerText = `Recommended: ${comp.recommended_winner}`;
  document.getElementById('clash-verdict-desc').innerText = comp.verdict;

  const rows = [
    { label: 'Headline CTC', valA: formatLakhs(a.data.headline_ctc), valB: formatLakhs(b.data.headline_ctc), diff: a.data.headline_ctc - b.data.headline_ctc },
    { label: 'Monthly Fixed In-Hand', valA: formatINR(a.data.monthly_pay_slip.monthly_fixed_in_hand), valB: formatINR(b.data.monthly_pay_slip.monthly_fixed_in_hand), diff: a.data.monthly_pay_slip.monthly_fixed_in_hand - b.data.monthly_pay_slip.monthly_fixed_in_hand },
    { label: 'Year 1 Total Net Cash', valA: formatINR(a.data.annual_cash_summary.year1_net_in_hand), valB: formatINR(b.data.annual_cash_summary.year1_net_in_hand), diff: comp.year1_net_cash_diff_inr },
    { label: 'Year 2 Sustainable Net Cash', valA: formatINR(a.data.annual_cash_summary.year2_net_in_hand), valB: formatINR(b.data.annual_cash_summary.year2_net_in_hand), diff: comp.year2_net_cash_diff_inr },
    { label: 'Income Tax TDS (Annual)', valA: formatINR(a.data.tax_calculation.total_annual_tax), valB: formatINR(b.data.tax_calculation.total_annual_tax), diff: -(a.data.tax_calculation.total_annual_tax - b.data.tax_calculation.total_annual_tax) },
    { label: 'At-Risk Component (Var + Stocks)', valA: `${comp.risk_score_a}%`, valB: `${comp.risk_score_b}%`, diff: -(comp.risk_score_a - comp.risk_score_b), isPct: true }
  ];

  let tbodyHtml = '';
  rows.forEach(r => {
    let diffText = '';
    let diffColor = 'text-slate-400';
    if (r.diff > 0) {
      diffText = `+${r.isPct ? r.diff.toFixed(1) + '%' : formatINR(r.diff)} (A)`;
      diffColor = 'text-indigo-400 font-bold';
    } else if (r.diff < 0) {
      diffText = `+${r.isPct ? Math.abs(r.diff).toFixed(1) + '%' : formatINR(Math.abs(r.diff))} (B)`;
      diffColor = 'text-emerald-400 font-bold';
    } else {
      diffText = 'Identical';
    }

    tbodyHtml += `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-2.5 px-4 font-semibold text-slate-300">${r.label}</td>
        <td class="py-2.5 px-4 text-indigo-300">${r.valA}</td>
        <td class="py-2.5 px-4 text-emerald-300">${r.valB}</td>
        <td class="py-2.5 px-4 text-right ${diffColor}">${diffText}</td>
      </tr>
    `;
  });

  document.getElementById('clash-table-body').innerHTML = tbodyHtml;
  renderClashChart(a, b);
}

function renderClashChart(a, b) {
  const ctx = document.getElementById('clashComparisonChart').getContext('2d');

  const chartData = {
    labels: ['Monthly In-Hand (x10)', 'Year 1 Net Cash (LPA)', 'Year 2 Net Cash (LPA)', 'Headline CTC (LPA)'],
    datasets: [
      {
        label: a.name,
        backgroundColor: '#6366f1',
        data: [
          (a.data.monthly_pay_slip.monthly_fixed_in_hand * 10) / 100000,
          a.data.annual_cash_summary.year1_net_in_hand / 100000,
          a.data.annual_cash_summary.year2_net_in_hand / 100000,
          a.data.headline_ctc / 100000
        ]
      },
      {
        label: b.name,
        backgroundColor: '#10b981',
        data: [
          (b.data.monthly_pay_slip.monthly_fixed_in_hand * 10) / 100000,
          b.data.annual_cash_summary.year1_net_in_hand / 100000,
          b.data.annual_cash_summary.year2_net_in_hand / 100000,
          b.data.headline_ctc / 100000
        ]
      }
    ]
  };

  if (state.clashChart) {
    state.clashChart.destroy();
  }

  state.clashChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            color: '#94a3b8',
            callback: (val) => `₹${val}L`
          },
          grid: { color: '#334155' }
        },
        x: {
          ticks: { color: '#cbd5e1' },
          grid: { display: false }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans' } }
        }
      }
    }
  });
}

// ========================================================
// TAB 3: TECH VS GOVT & PSU
// ========================================================
async function runGovtComparison() {
  const techCtc = parseFloat(document.getElementById('sarkari-tech-ctc').value) || 0;
  const postId = document.getElementById('sarkari-post-select').value;
  const cityTier = document.getElementById('sarkari-city-tier').value;

  const payload = {
    tech_ctc: techCtc,
    post_id: postId,
    city_tier: cityTier
  };

  try {
    const res = await fetch('/api/govt-compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Government compare request failed');
    const data = await res.json();
    renderGovtResults(data);
  } catch (err) {
    console.error('Govt comparison error:', err);
  }
}

function renderGovtResults(data) {
  const pvt = data.private_tech;
  const pub = data.public_sector;
  const verdict = data.verdict;

  // Header & Badges
  document.getElementById('sarkari-pvt-ctc-badge').innerText = formatLakhs(pvt.headline_ctc);
  document.getElementById('sarkari-govt-title-header').innerText = pub.post_title;
  document.getElementById('sarkari-govt-level-badge').innerText = pub.service_category;

  // Metrics
  document.getElementById('sarkari-pvt-monthly').innerText = formatINR(pvt.monthly_in_hand);
  document.getElementById('sarkari-pvt-annual').innerText = formatINR(pvt.annual_in_hand);

  document.getElementById('sarkari-govt-monthly').innerText = formatINR(pub.monthly_in_hand);
  document.getElementById('sarkari-govt-annual').innerText = formatINR(pub.annual_in_hand);
  document.getElementById('sarkari-govt-economic').innerText = formatINR(pub.total_economic_annual);
  document.getElementById('sarkari-govt-security').innerText = pub.job_security;
  document.getElementById('sarkari-govt-hours').innerText = pub.working_hours;

  // Verdict Box
  document.getElementById('sarkari-verdict-title').innerText = verdict.summary;
  const gap = verdict.in_hand_gap_monthly;
  if (gap > 0) {
    document.getElementById('sarkari-verdict-desc').innerText = `Private IT offers ₹${formatINR(gap)} extra liquid monthly cash, but ${pub.post_title} provides matching pension wealth, subsidized quarters, and lifetime healthcare.`;
    document.getElementById('sarkari-gap-amount').className = 'text-lg font-black font-mono text-emerald-400';
    document.getElementById('sarkari-gap-amount').innerText = `+${formatINR(gap)} IT Cash`;
  } else {
    document.getElementById('sarkari-verdict-desc').innerText = `${pub.post_title} beats this private package by ₹${formatINR(Math.abs(gap))} in monthly bank deposit, plus constitutional job security!`;
    document.getElementById('sarkari-gap-amount').className = 'text-lg font-black font-mono text-sarkari-400';
    document.getElementById('sarkari-gap-amount').innerText = `+${formatINR(Math.abs(gap))} Govt Cash`;
  }

  // Perks list rendering
  let perksHtml = '';
  if (pub.perks && pub.perks.length > 0) {
    pub.perks.forEach(p => {
      perksHtml += `
        <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          <i data-lucide="check" class="w-4 h-4 text-emerald-400 shrink-0"></i>
          <span>${p}</span>
        </div>
      `;
    });
  } else {
    perksHtml = `<span class="text-slate-400 italic">Official central civil service benefits apply.</span>`;
  }
  document.getElementById('sarkari-perks-list').innerHTML = perksHtml;
  lucide.createIcons();
}

// ========================================================
// TAB 4: VERIFIED SALARY EXPLORER
// ========================================================
async function loadExplorerCompanies() {
  try {
    const res = await fetch('/api/companies');
    if (!res.ok) throw new Error('Failed to load companies');
    const data = await res.json();
    state.companies = data.companies;
    filterCompanies();
  } catch (err) {
    console.error('Explorer error:', err);
  }
}

function filterCompanies() {
  const q = document.getElementById('explorer-search').value.toLowerCase().trim();
  const ind = document.getElementById('explorer-industry').value.toLowerCase().trim();

  state.filteredCompanies = state.companies.filter(c => {
    const matchesQ = !q || c.company_name.toLowerCase().includes(q) || c.canonical_name.toLowerCase().includes(q) || (c.industry_category && c.industry_category.toLowerCase().includes(q));
    const matchesInd = !ind || (c.industry_category && c.industry_category.toLowerCase().includes(ind));
    return matchesQ && matchesInd;
  });

  document.getElementById('explorer-count').innerText = state.filteredCompanies.length;
  renderCompanyCards();
}

function renderCompanyCards() {
  const container = document.getElementById('explorer-cards-grid');
  if (state.filteredCompanies.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-400">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-slate-500 mb-2"></i>
        <p class="font-semibold">No verified employers found matching query.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '';
  state.filteredCompanies.forEach(c => {
    const obs = c.compensation_observations || [];
    const campus = c.campus_reports || [];
    
    // Find min & max CTC
    let minCtc = null;
    let maxCtc = null;
    obs.forEach(o => {
      const minVal = o.annual_ctc ? o.annual_ctc.min_inr : 0;
      const maxVal = o.annual_ctc ? o.annual_ctc.max_inr : minVal;
      if (minVal && (!minCtc || minVal < minCtc)) minCtc = minVal;
      if (maxVal && (!maxCtc || maxVal > maxCtc)) maxCtc = maxVal;
    });

    let ctcDisplay = '₹0';
    if (minCtc) {
      ctcDisplay = maxCtc && maxCtc > minCtc ? `${formatLakhs(minCtc)} - ${formatLakhs(maxCtc)}` : formatLakhs(minCtc);
    } else if (campus.length > 0 && campus[0].campus_ctc_min_lpa) {
      const cr = campus[0];
      ctcDisplay = cr.campus_ctc_max_lpa ? `${cr.campus_ctc_min_lpa} - ${cr.campus_ctc_max_lpa} LPA` : `${cr.campus_ctc_min_lpa} LPA`;
    }

    html += `
      <div onclick="openCompanyModal('${c.company_id}')" class="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer space-y-3 group flex flex-col justify-between shadow-lg">
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
              ${c.company_name}
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 shrink-0">
              ${c.company_id}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
            ${c.industry_category || 'Technology & Engineering'}
          </span>
        </div>

        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
          <span class="text-[10px] text-slate-400 uppercase font-semibold">Typical CTC:</span>
          <span class="text-xs font-mono font-bold text-emerald-400">${ctcDisplay}</span>
        </div>

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span>${obs.length} verified roles • ${campus.length} campus tracks</span>
          <span class="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold text-[10px]">
            Details <i data-lucide="chevron-right" class="w-3 h-3"></i>
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();
}

function openCompanyModal(companyId) {
  const c = state.companies.find(comp => comp.company_id === companyId);
  if (!c) return;

  document.getElementById('modal-company-name').innerText = c.company_name;
  document.getElementById('modal-industry').innerText = `${c.industry_category || 'Technology'} • ${c.company_id}`;

  let contentHtml = `
    <div class="flex flex-wrap gap-3 pb-3 border-b border-slate-800">
      ${c.official_website ? `<a href="${c.official_website}" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"><i data-lucide="globe" class="w-3.5 h-3.5 text-emerald-400"></i> Official Website</a>` : ''}
      ${c.careers_url ? `<a href="${c.careers_url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-brand-900/50 hover:bg-brand-900 border border-brand-700 text-emerald-300 flex items-center gap-1.5 transition-colors"><i data-lucide="external-link" class="w-3.5 h-3.5 text-emerald-400"></i> Verified Careers Portal</a>` : ''}
    </div>
  `;

  contentHtml += `<div><h4 class="font-bold text-white text-xs uppercase tracking-wider mb-2">Verified Compensation Tracks</h4>`;
  if (c.compensation_observations && c.compensation_observations.length > 0) {
    contentHtml += `<div class="space-y-2">`;
    c.compensation_observations.forEach(o => {
      const ctcText = o.annual_ctc.max_inr && o.annual_ctc.max_inr > o.annual_ctc.min_inr ? `${formatINR(o.annual_ctc.min_inr)} - ${formatINR(o.annual_ctc.max_inr)}` : formatINR(o.annual_ctc.min_inr);

      contentHtml += `
        <div class="p-3 bg-slate-850 rounded-xl border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-100 text-xs">${o.job_title || 'Software Engineer'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/60 text-emerald-400 uppercase font-semibold">Verified</span>
          </div>
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400">Annual CTC:</span>
            <span class="font-bold text-emerald-400">${ctcText}</span>
          </div>
          ${o.breakdown_inr && (o.breakdown_inr.base_salary || o.breakdown_inr.variable_pay) ? `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
              <div><span class="text-slate-400 block text-[10px]">Base Salary:</span><span class="text-white">${formatINR(o.breakdown_inr.base_salary)}</span></div>
              <div><span class="text-slate-400 block text-[10px]">Variable Pay:</span><span class="text-amber-400">${formatINR(o.breakdown_inr.variable_pay)}</span></div>
              <div><span class="text-slate-400 block text-[10px]">Joining Bonus:</span><span class="text-indigo-400">${formatINR(o.breakdown_inr.joining_bonus)}</span></div>
              <div><span class="text-slate-400 block text-[10px]">Equity / ESOP:</span><span class="text-purple-400">${formatINR(o.breakdown_inr.equity)}</span></div>
            </div>
          ` : ''}
          ${o.evidence_notes ? `<p class="text-[11px] text-slate-400 italic">${o.evidence_notes}</p>` : ''}
          ${o.source_url ? `<a href="${o.source_url}" target="_blank" class="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"><i data-lucide="link" class="w-3 h-3"></i> Direct Source Link</a>` : ''}
        </div>
      `;
    });
    contentHtml += `</div>`;
  }
  contentHtml += `</div>`;

  if (c.campus_reports && c.campus_reports.length > 0) {
    contentHtml += `<div><h4 class="font-bold text-white text-xs uppercase tracking-wider mt-4 mb-2">Campus Placement Benchmarks</h4><div class="space-y-2">`;
    c.campus_reports.forEach(cr => {
      contentHtml += `
        <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span class="font-semibold text-slate-200 block">${cr.input_company_name}</span>
            <span class="text-[10px] text-slate-400">${cr.note || 'Campus benchmark'}</span>
          </div>
          <span class="font-mono font-bold text-emerald-400">${cr.campus_ctc_min_lpa} - ${cr.campus_ctc_max_lpa || cr.campus_ctc_min_lpa} LPA</span>
        </div>
      `;
    });
    contentHtml += `</div></div>`;
  }

  document.getElementById('modal-content').innerHTML = contentHtml;
  document.getElementById('company-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeCompanyModal() {
  document.getElementById('company-modal').classList.add('hidden');
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  updateCalculation();
  loadExplorerCompanies();
});
