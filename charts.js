/* ─────────────────────────────────────────────────
   California Clemency Dashboard — Charts (Chart.js)
   ───────────────────────────────────────────────── */

// ── Chart.js Global Defaults ──────────────────────
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size   = 12;
Chart.defaults.color       = '#6B7280';
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(26,43,74,0.92)';
Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 13 };
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.boxPadding = 4;

// ── Color constants ───────────────────────────────
const C = {
  pardons:       '#2563EB',
  commutations:  '#059669',
  reprieves:     '#D97706',
  denied:        '#DC2626',
  applications:  '#6366F1',
  pardonsAlpha:  'rgba(37,99,235,0.15)',
  commAlpha:     'rgba(5,150,105,0.15)',
  white:   '#3B82F6',
  hisp:    '#10B981',
  black:   '#8B5CF6',
  asian:   '#F59E0B',
  other:   '#9CA3AF',
};

// ── Helper: responsive height ─────────────────────
function makeResponsiveChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  canvas.parentElement.style.position = 'relative';
  return new Chart(canvas, {
    ...config,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...(config.options || {}),
    },
  });
}

// ── Tick formatter helpers ────────────────────────
const pctFmt = v => v + '%';
const numFmt = v => v.toLocaleString();


/* ══════════════════════════════════════════════════
   SECTION 1 — TRENDS
   ══════════════════════════════════════════════════ */

function initAnnualGrantsChart() {
  const years = ANNUAL_GRANTS.map(d => d.year);
  makeResponsiveChart('chart-annual-grants', {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Pardons',
          data: ANNUAL_GRANTS.map(d => d.pardons),
          backgroundColor: C.pardons,
          borderRadius: 4,
        },
        {
          label: 'Commutations',
          data: ANNUAL_GRANTS.map(d => d.commutations),
          backgroundColor: C.commutations,
          borderRadius: 4,
        },
        {
          label: 'Reprieves (non-death row)',
          data: ANNUAL_GRANTS.map(d => d.reprieves),
          backgroundColor: C.reprieves,
          borderRadius: 4,
        },
      ],
    },
    options: {
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            afterBody(ctx) {
              const yr = ANNUAL_GRANTS[ctx[0].dataIndex];
              const note = POLICY_EVENTS.find(e => e.year === yr.year);
              return note ? [`\n⚑ ${note.label}`] : [];
            },
          },
        },
      },
    },
  });
}

function initCumulativeChart() {
  // Build cumulative running totals from ANNUAL_GRANTS
  let cp = 0, cc = 0;
  const labels = [];
  const cumulPardons = [];
  const cumulComm    = [];

  ANNUAL_GRANTS.forEach(d => {
    cp += d.pardons;
    cc += d.commutations;
    labels.push(d.year);
    cumulPardons.push(cp);
    cumulComm.push(cc);
  });

  makeResponsiveChart('chart-cumulative', {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Cumulative Pardons',
          data: cumulPardons,
          borderColor: C.pardons,
          backgroundColor: C.pardonsAlpha,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Cumulative Commutations',
          data: cumulComm,
          borderColor: C.commutations,
          backgroundColor: C.commAlpha,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      plugins: { legend: { position: 'bottom' } },
    },
  });
}


/* ══════════════════════════════════════════════════
   SECTION 2 — DEMOGRAPHICS
   ══════════════════════════════════════════════════ */

function initGenderChart() {
  const data = DEMOGRAPHICS.gender;
  makeResponsiveChart('chart-gender', {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: [C.pardons, C.commutations, C.other],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      }],
    },
    options: {
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
      },
    },
  });
}

function initRaceChart() {
  const data = DEMOGRAPHICS.race;
  makeResponsiveChart('chart-race', {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: [C.white, C.hisp, C.black, C.asian, C.other],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      }],
    },
    options: {
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
      },
    },
  });
}

function initAgeChart() {
  const data = DEMOGRAPHICS.ageBrackets;
  makeResponsiveChart('chart-age', {
    type: 'bar',
    data: {
      labels: data.map(d => d.label),
      datasets: [
        {
          label: 'Applicants %',
          data: data.map(d => d.applicants),
          backgroundColor: 'rgba(99,102,241,0.7)',
          borderRadius: 3,
        },
        {
          label: 'Recipients %',
          data: data.map(d => d.recipients),
          backgroundColor: 'rgba(5,150,105,0.7)',
          borderRadius: 3,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          max: 45,
          ticks: { callback: pctFmt },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y: { grid: { display: false } },
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } },
      },
    },
  });
}


/* ══════════════════════════════════════════════════
   SECTION 3 — POLICY IMPACT
   ══════════════════════════════════════════════════ */

function initPolicyChart() {
  const years = ANNUAL_GRANTS.map(d => d.year);

  // Annotation lines for each policy event
  const annotations = {};
  POLICY_EVENTS.forEach((e, i) => {
    annotations[`event${i}`] = {
      type: 'line',
      xMin: e.year,
      xMax: e.year,
      borderColor: 'rgba(200,149,42,0.6)',
      borderWidth: 1.5,
      borderDash: [5, 4],
      label: {
        display: true,
        content: e.label,
        position: 'start',
        backgroundColor: 'rgba(200,149,42,0.15)',
        color: '#92400E',
        font: { size: 10, weight: '600' },
        padding: { x: 6, y: 3 },
        borderRadius: 4,
        yAdjust: -8 + (i * 22),
      },
    };
  });

  makeResponsiveChart('chart-policy', {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Pardons',
          data: ANNUAL_GRANTS.map(d => d.pardons),
          borderColor: C.pardons,
          backgroundColor: 'rgba(37,99,235,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
        },
        {
          label: 'Commutations',
          data: ANNUAL_GRANTS.map(d => d.commutations),
          borderColor: C.commutations,
          backgroundColor: 'rgba(5,150,105,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
        },
      ],
    },
    options: {
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      plugins: {
        legend: { position: 'bottom' },
        annotation: { annotations },
      },
    },
  });
}

function renderPolicyTimeline() {
  const container = document.getElementById('policy-timeline-list');
  if (!container) return;
  container.innerHTML = POLICY_EVENTS.map(e => `
    <div class="policy-event">
      <div>
        <div class="policy-year">${e.year}</div>
        <div class="policy-label">${e.label}</div>
        <div class="policy-detail">${e.detail}</div>
      </div>
    </div>
  `).join('');
}


/* ══════════════════════════════════════════════════
   SECTION 4 — OFFENSE TYPES
   ══════════════════════════════════════════════════ */

function offenseDoughnut(id, data) {
  makeResponsiveChart(id, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.pct),
        backgroundColor: [C.denied, C.pardons, C.reprieves],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      }],
    },
    options: {
      cutout: '58%',
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } },
      },
    },
  });
}

function initOffenseCharts() {
  offenseDoughnut('chart-offense-apps',          OFFENSE_TYPES.applications);
  offenseDoughnut('chart-offense-pardons',        OFFENSE_TYPES.pardonsGranted);
  offenseDoughnut('chart-offense-commutations',   OFFENSE_TYPES.commutationsGranted);
}


/* ══════════════════════════════════════════════════
   SECTION 5 — GEOGRAPHY (top counties bar chart)
   ══════════════════════════════════════════════════ */

function initCountiesChart() {
  const sorted = [...COUNTY_DATA].sort((a, b) => b.grants - a.grants).slice(0, 12);
  makeResponsiveChart('chart-counties', {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.county),
      datasets: [
        {
          label: 'Grants',
          data: sorted.map(d => d.grants),
          backgroundColor: sorted.map(d =>
            d.grantRate > 20 ? '#1D4ED8' : d.grantRate > 15 ? '#3B82F6' : '#93C5FD'
          ),
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const c = sorted[ctx.dataIndex];
              return [` Grants: ${c.grants}`, ` Applications: ${c.applications}`, ` Grant Rate: ${c.grantRate}%`];
            },
          },
        },
      },
    },
  });
}


/* ══════════════════════════════════════════════════
   SECTION 6 — QUALITATIVE FACTORS
   ══════════════════════════════════════════════════ */

function initReasonsCharts() {
  const granted = [...CLEMENCY_REASONS.granted].sort((a, b) => b.pct - a.pct);
  makeResponsiveChart('chart-reasons-grant', {
    type: 'bar',
    data: {
      labels: granted.map(d => d.reason),
      datasets: [{
        label: '% of Granted Cases',
        data: granted.map(d => d.pct),
        backgroundColor: granted.map((d, i) =>
          i === 0 ? C.pardons : `rgba(37,99,235,${0.8 - i * 0.12})`
        ),
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, max: 45, ticks: { callback: pctFmt }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw}% of granted cases` } },
      },
    },
  });

  const denied = [...CLEMENCY_REASONS.denied].sort((a, b) => b.pct - a.pct);
  makeResponsiveChart('chart-reasons-deny', {
    type: 'bar',
    data: {
      labels: denied.map(d => d.reason),
      datasets: [{
        label: '% of Denied Cases',
        data: denied.map(d => d.pct),
        backgroundColor: denied.map((d, i) =>
          `rgba(220,38,38,${0.9 - i * 0.18})`
        ),
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, max: 50, ticks: { callback: pctFmt }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw}% of denied cases` } },
      },
    },
  });
}


/* ══════════════════════════════════════════════════
   SECTION 7 — RECIDIVISM
   ══════════════════════════════════════════════════ */

function initRecidivismChart() {
  makeResponsiveChart('chart-recidivism', {
    type: 'bar',
    data: {
      labels: ['3-Year Rate', '5-Year Rate'],
      datasets: [
        {
          label: 'Clemency Recipients',
          data: [RECIDIVISM.clemencyRecipients, RECIDIVISM.fiveYear.clemencyRecipients],
          backgroundColor: C.commutations,
          borderRadius: 5,
        },
        {
          label: 'General Parolees',
          data: [RECIDIVISM.generalParolees, RECIDIVISM.fiveYear.generalParolees],
          backgroundColor: C.denied,
          borderRadius: 5,
        },
      ],
    },
    options: {
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          max: 70,
          ticks: { callback: pctFmt },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } },
      },
    },
  });
}


/* ══════════════════════════════════════════════════
   SECTION 8 — COMPARATIVE
   ══════════════════════════════════════════════════ */

function initComparativeChart() {
  const sorted = [...STATE_COMPARISON].sort((a, b) => b.total - a.total);
  makeResponsiveChart('chart-comparative', {
    type: 'bar',
    data: {
      labels: sorted.map(d => `${d.state}\n(${d.period})`),
      datasets: [
        {
          label: 'Pardons',
          data: sorted.map(d => d.pardons),
          backgroundColor: C.pardons,
          borderRadius: 4,
        },
        {
          label: 'Commutations',
          data: sorted.map(d => d.commutations),
          backgroundColor: C.commutations,
          borderRadius: 4,
        },
      ],
    },
    options: {
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0 } },
        y: { beginAtZero: true, stacked: false, grid: { color: 'rgba(0,0,0,0.05)' } },
      },
      plugins: { legend: { position: 'bottom' } },
    },
  });
}


/* ══════════════════════════════════════════════════
   SECTION 9 — NOTABLE CASES
   ══════════════════════════════════════════════════ */

function initWaitTimeChart() {
  const sorted = [...CASE_STUDIES].sort((a, b) => b.yearsWaiting - a.yearsWaiting);
  makeResponsiveChart('chart-waittime', {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.name),
      datasets: [{
        label: 'Years from Conviction to Clemency',
        data: sorted.map(d => d.yearsWaiting),
        backgroundColor: sorted.map(d =>
          d.type === 'Pardon' ? C.pardons : d.type === 'Reprieve' ? C.reprieves : C.commutations
        ),
        borderRadius: 5,
      }],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true, max: 35, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const c = sorted[ctx.dataIndex];
              return [` ${c.type}`, ` ${c.yearsWaiting} years waiting`];
            },
          },
        },
      },
    },
  });
}

function renderCaseStudies() {
  const grid = document.getElementById('case-studies-grid');
  if (!grid) return;
  grid.innerHTML = CASE_STUDIES.map(c => {
    const badgeClass = c.type === 'Pardon' ? 'badge-pardon' :
                       c.type === 'Reprieve' ? 'badge-reprieve' : 'badge-commutation';
    const tagsHtml = c.tags.map(t => `<span class="case-tag">${t}</span>`).join('');
    return `
      <div class="case-card">
        <div class="case-card-header">
          <div class="case-name">${c.name}</div>
          <span class="case-type-badge ${badgeClass}">${c.type}</span>
        </div>
        <div class="case-offense">${c.offense}</div>
        <div class="case-key-factor">${c.keyFactor}</div>
        <div class="case-tags">${tagsHtml}</div>
        <div class="case-years">
          Convicted <strong>${c.convictionYear}</strong> → ${c.type} <strong>${c.clemencyYear}</strong>
          &nbsp;·&nbsp; <strong>${c.yearsWaiting}</strong> years
        </div>
      </div>
    `;
  }).join('');
}


/* ══════════════════════════════════════════════════
   SECTION 10 — COMMUNITY
   ══════════════════════════════════════════════════ */

function renderCommunityStats() {
  const grid = document.getElementById('community-stats-grid');
  if (!grid) return;
  const items = [
    { icon: '🤝', value: '15%', label: 'Granted cases where victim family supported clemency' },
    { icon: '💰', value: '$107M', label: 'CalVIP grants to 42 communities for violence prevention' },
    { icon: '🏥', value: '$291M', label: 'CARE Court behavioral health investment (2023)' },
    { icon: '📋', value: '33%', label: 'Clemency grants where possible innocence was a factor' },
  ];
  grid.innerHTML = items.map(item => `
    <div class="community-stat">
      <div class="community-icon">${item.icon}</div>
      <div>
        <div class="community-value">${item.value}</div>
        <div class="community-label">${item.label}</div>
      </div>
    </div>
  `).join('');
}


/* ══════════════════════════════════════════════════
   HERO COUNTER ANIMATION
   ══════════════════════════════════════════════════ */

function animateCounter(el, target, duration = 1800) {
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function startHeroCounters() {
  animateCounter(document.getElementById('counter-pardons'),       HERO_STATS.totalPardons,       1800);
  animateCounter(document.getElementById('counter-commutations'),  HERO_STATS.totalCommutations,  2000);
  animateCounter(document.getElementById('counter-reprieves'),     HERO_STATS.totalReprieves,     1500);
}


/* ══════════════════════════════════════════════════
   SCROLL SPY + SECTION ANIMATION
   ══════════════════════════════════════════════════ */

function initScrollSpy() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Fade-in sections
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  sections.forEach(s => sectionObs.observe(s));

  // Active nav highlight
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObs.observe(s));
}


/* ══════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Register annotation plugin globally
  if (window.ChartAnnotation) {
    Chart.register(window.ChartAnnotation);
  }

  // Hero
  startHeroCounters();

  // Charts
  initAnnualGrantsChart();
  initCumulativeChart();
  initGenderChart();
  initRaceChart();
  initAgeChart();
  initPolicyChart();
  renderPolicyTimeline();
  initOffenseCharts();
  initCountiesChart();
  initReasonsCharts();
  initRecidivismChart();
  initComparativeChart();
  initWaitTimeChart();

  // DOM renders
  renderCaseStudies();
  renderCommunityStats();

  // Navigation
  initScrollSpy();
});
