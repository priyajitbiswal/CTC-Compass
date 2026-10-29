/**
 * CTC Compass India — Modern Interactive Frontend Application
 */

// Application State
const state = {
  currentTab: 'calculator',
  currentTaxRegime: 'new',
  companies: [],
  filteredCompanies: [],
  breakdownChart: null,
  clashChart: null,
  companyPresets: {
    'TCS_NINJA': { ctc: 340000, basic: 40, variable: 5, joining: 0, equity: 0 },
    'TCS_DIGITAL': { ctc: 700000, basic: 40, variable: 8, joining: 0, equity: 0 },
    'HCL_ASCEND': { ctc: 375000, basic: 40, variable: 5, joining: 0, equity: 0 },
    'WIPRO_TURBO': { ctc: 650000, basic: 40, variable: 10, joining: 0, equity: 0 },
    'FOODHUB': { ctc: 1400000, basic: 45, variable: 10, joining: 100000, equity: 0 },
    'HYPERVERGE': { ctc: 1650000, basic: 40, variable: 15, joining: 150000, equity: 100000 },
    'FUTURES_FIRST': { ctc: 1890000, basic: 40, variable: 20, joining: 200000, equity: 0 },
    'QUALCOMM': { ctc: 2060000, basic: 40, variable: 15, joining: 250000, equity: 200000 },
    'BROADCOM': { ctc: 4227681, basic: 40, variable: 20, joining: 500000, equity: 800000 }
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

// ========================================================
// NAVIGATION
// ========================================================
function switchTab(tabId) {
  state.currentTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  // Trigger relevant updates
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
  document.getElementById('input-ctc').value = 1200000;
  document.getElementById('slider-ctc').value = 1200000;
  document.getElementById('label-ctc-lakhs').innerText = '12.00 LPA';
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

  // 1. KPI Cards
  document.getElementById('metric-monthly-inhand').innerText = formatINR(slip.monthly_fixed_in_hand);
  document.getElementById('metric-annual-inhand').innerText = formatINR(annual.year1_net_in_hand);
  document.getElementById('metric-y2-annual').innerText = `Yr 2+: ${formatINR(annual.year2_net_in_hand)}`;
  document.getElementById('metric-annual-tax').innerText = formatINR(tax.total_annual_tax);
  document.getElementById('metric-effective-tax').innerText = `${tax.effective_tax_rate}% effective tax`;
  document.getElementById('metric-realization-rate').innerText = `${metrics.cash_realization_rate_pct}%`;

  // 2. Monthly Salary Slip Table
  document.getElementById('slip-basic').innerText = formatINR(slip.breakdown.basic_pay);
  document.getElementById('slip-hra').innerText = formatINR(slip.breakdown.hra);
  document.getElementById('slip-special').innerText = formatINR(slip.breakdown.special_allowance);
  document.getElementById('slip-gross').innerText = formatINR(slip.fixed_gross);

  document.getElementById('slip-pf').innerText = formatINR(slip.deductions.employee_pf);
  document.getElementById('slip-pt').innerText = formatINR(slip.deductions.professional_tax);
  document.getElementById('slip-tds').innerText = formatINR(slip.deductions.income_tax_tds);
  document.getElementById('slip-deductions-total').innerText = formatINR(slip.deductions.total_deductions);

  // 3. Notes
  document.getElementById('note-employer-pf').innerText = formatINR(employer.employer_epf) + '/yr';
  document.getElementById('note-gratuity').innerText = formatINR(employer.gratuity) + '/yr';

  // 4. Update Waterfall / Breakdown Chart
  document.getElementById('chart-ctc-label').innerText = `${formatLakhs(data.headline_ctc)} Breakdown`;
  renderBreakdownChart(data);
}

function renderBreakdownChart(data) {
  const ctx = document.getElementById('ctcBreakdownChart').getContext('2d');
  
  const inHandAnnual = data.annual_cash_summary.year1_net_in_hand;
  const taxAnnual = data.tax_calculation.total_annual_tax;
  const employeeDeductions = (data.employer_deductions.employer_epf) + 2400; // EPF + PT
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

  // Header Titles
  document.getElementById('clash-table-header-a').innerText = a.name;
  document.getElementById('clash-table-header-b').innerText = b.name;

  // Verdict Box
  document.getElementById('clash-verdict-title').innerText = `Recommended: ${comp.recommended_winner}`;
  document.getElementById('clash-verdict-desc').innerText = comp.verdict;

  // Table Rows
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

  // Clash Comparison Bar Chart
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
// TAB 3: TECH VS SARKARI
// ========================================================
async function runGovtComparison() {
  const techCtc = parseFloat(document.getElementById('sarkari-tech-ctc').value) || 0;
  const postVal = document.getElementById('sarkari-post-select').value.split('|');
  const payLevel = postVal[0];
  const postName = postVal[1] || 'Central Govt Post';
  const cityTier = document.getElementById('sarkari-city-tier').value;
  const daRate = parseFloat(document.getElementById('sarkari-da-rate').value) || 50;

  const payload = {
    tech_ctc: techCtc,
    govt_post_name: postName,
    govt_pay_level: payLevel,
    city_tier: cityTier,
    da_rate_pct: daRate
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
  const govt = data.central_government;
  const verdict = data.verdict;

  // Badges & Headers
  document.getElementById('sarkari-pvt-ctc-badge').innerText = formatLakhs(pvt.headline_ctc);
  document.getElementById('sarkari-govt-level-badge').innerText = `7th CPC ${govt.pay_level}`;

  // Metrics
  document.getElementById('sarkari-pvt-monthly').innerText = formatINR(pvt.monthly_in_hand);
  document.getElementById('sarkari-pvt-annual').innerText = formatINR(pvt.annual_in_hand);

  document.getElementById('sarkari-govt-monthly').innerText = formatINR(govt.monthly_in_hand);
  document.getElementById('sarkari-govt-annual').innerText = formatINR(govt.annual_in_hand);
  document.getElementById('sarkari-govt-economic').innerText = formatINR(govt.annual_economic_package);

  // Verdict Box
  document.getElementById('sarkari-verdict-title').innerText = verdict.summary;
  const gap = verdict.in_hand_difference_monthly;
  if (gap > 0) {
    document.getElementById('sarkari-verdict-desc').innerText = `Private IT offers ₹${formatINR(gap)} extra liquid monthly cash, but Central Govt provides 14% matching NPS wealth and total job stability.`;
    document.getElementById('sarkari-gap-amount').className = 'text-lg font-black font-mono text-emerald-400';
    document.getElementById('sarkari-gap-amount').innerText = `+${formatINR(gap)} IT Cash`;
  } else {
    document.getElementById('sarkari-verdict-desc').innerText = `Central Govt post Level ${govt.pay_level} beats this IT package in guaranteed monthly cash with lifetime medical and 40-hr work weeks.`;
    document.getElementById('sarkari-gap-amount').className = 'text-lg font-black font-mono text-sarkari-400';
    document.getElementById('sarkari-gap-amount').innerText = `+${formatINR(Math.abs(gap))} Govt Cash`;
  }

  // 7th CPC Allowances Breakdown
  // Compute approximate breakdown from monthly gross
  const basic = govt.pay_level === 'Level 8' ? 47600 : govt.pay_level === 'Level 7' ? 44900 : govt.pay_level === 'Level 6' ? 35400 : govt.pay_level === 'Level 5' ? 29200 : 25500;
  const da = Math.round(basic * 0.50);
  const hra = Math.round(basic * 0.30);
  const ta = 5400;
  const deductions = Math.round((basic + da) * 0.10) + 650 + 60;

  document.getElementById('sarkari-part-basic').innerText = formatINR(basic);
  document.getElementById('sarkari-part-da').innerText = formatINR(da);
  document.getElementById('sarkari-part-hra').innerText = formatINR(hra);
  document.getElementById('sarkari-part-ta').innerText = formatINR(ta);
  document.getElementById('sarkari-part-deductions').innerText = `-${formatINR(deductions)}`;
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
  const filterType = document.getElementById('explorer-breakdown-filter').value;

  state.filteredCompanies = state.companies.filter(c => {
    const matchesQ = !q || c.company_name.toLowerCase().includes(q) || c.canonical_name.toLowerCase().includes(q) || (c.industry_category && c.industry_category.toLowerCase().includes(q));
    const matchesInd = !ind || (c.industry_category && c.industry_category.toLowerCase().includes(ind));
    
    let matchesType = true;
    if (filterType === 'has_breakdown') {
      matchesType = c.compensation_observations.some(o => o.breakdown_inr && (o.breakdown_inr.base_salary || o.breakdown_inr.variable_pay));
    } else if (filterType === 'campus_only') {
      matchesType = c.campus_reports && c.campus_reports.length > 0;
    }

    return matchesQ && matchesInd && matchesType;
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
        <p class="font-semibold">No matching employers found.</p>
        <p class="text-xs text-slate-500 mt-1">Try broadening your search query or reset filters.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let html = '';
  state.filteredCompanies.slice(0, 48).forEach(c => {
    const obsCount = c.compensation_observations.length;
    const campusCount = c.campus_reports.length;
    
    // Find min/max CTC
    let ctcDisplay = 'CTC on request / unlisted';
    let minCtc = null;
    let maxCtc = null;
    c.compensation_observations.forEach(o => {
      if (o.annual_ctc.min_inr) {
        if (!minCtc || o.annual_ctc.min_inr < minCtc) minCtc = o.annual_ctc.min_inr;
      }
      if (o.annual_ctc.max_inr) {
        if (!maxCtc || o.annual_ctc.max_inr > maxCtc) maxCtc = o.annual_ctc.max_inr;
      }
    });

    if (minCtc) {
      ctcDisplay = maxCtc && maxCtc > minCtc ? `${formatLakhs(minCtc)} - ${formatLakhs(maxCtc)}` : formatLakhs(minCtc);
    } else if (campusCount > 0 && c.campus_reports[0].campus_ctc_min_lpa) {
      const cr = c.campus_reports[0];
      ctcDisplay = cr.campus_ctc_max_lpa ? `${cr.campus_ctc_min_lpa} - ${cr.campus_ctc_max_lpa} LPA` : `${cr.campus_ctc_min_lpa} LPA`;
    }

    html += `
      <div onclick="openCompanyModal('${c.company_id}')" class="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer space-y-3 group flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors line-clamp-1">
              ${c.company_name}
            </h3>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 shrink-0">
              ${c.company_id}
            </span>
          </div>
          <span class="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
            ${c.industry_category || 'Technology & Engineering'}
          </span>
        </div>

        <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <span class="text-[10px] text-slate-400 uppercase font-semibold">Typical CTC:</span>
          <span class="text-xs font-mono font-bold text-emerald-400">${ctcDisplay}</span>
        </div>

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
          <span>${obsCount} salary points • ${campusCount} campus reports</span>
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

  // Compensation Observations
  contentHtml += `<div><h4 class="font-bold text-white text-xs uppercase tracking-wider mb-2">Verified Compensation Observations</h4>`;
  if (c.compensation_observations && c.compensation_observations.length > 0) {
    contentHtml += `<div class="space-y-2">`;
    c.compensation_observations.forEach(o => {
      const ctcText = o.annual_ctc.max_inr && o.annual_ctc.max_inr > o.annual_ctc.min_inr ? `${formatINR(o.annual_ctc.min_inr)} - ${formatINR(o.annual_ctc.max_inr)}` : formatINR(o.annual_ctc.min_inr);
      const confColor = o.confidence === 'high' ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60' : o.confidence === 'medium' ? 'text-amber-400 border-amber-800 bg-amber-950/60' : 'text-slate-400 border-slate-700 bg-slate-800';

      contentHtml += `
        <div class="p-3 bg-slate-800/70 rounded-xl border border-slate-700/80 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-100 text-xs">${o.job_title || 'Campus Full-Time Offer'}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded border ${confColor} uppercase font-semibold">${o.confidence} Confidence</span>
          </div>
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400">Annual CTC:</span>
            <span class="font-bold text-emerald-400">${ctcText}</span>
          </div>
          ${o.breakdown_inr && (o.breakdown_inr.base_salary || o.breakdown_inr.variable_pay) ? `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/60 text-[11px] font-mono">
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
  } else {
    contentHtml += `<p class="text-slate-400 italic text-xs">No granular compensation observation recorded yet.</p>`;
  }
  contentHtml += `</div>`;

  // Campus Reports
  if (c.campus_reports && c.campus_reports.length > 0) {
    contentHtml += `<div><h4 class="font-bold text-white text-xs uppercase tracking-wider mt-4 mb-2">Campus Placement Benchmarks</h4><div class="space-y-2">`;
    c.campus_reports.forEach(cr => {
      contentHtml += `
        <div class="p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
          <div>
            <span class="font-semibold text-slate-200 block">${cr.input_company_name}</span>
            <span class="text-[10px] text-slate-400">${cr.note || 'Campus listing'}</span>
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

// ========================================================
// INITIALIZATION
// ========================================================
window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  updateCalculation();
  loadExplorerCompanies();
});
