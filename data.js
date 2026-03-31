// California Executive Clemency Data (2019–2026)
// Source: claude.md — synthesized from CA Governor's Office annual reports
// Note: Fields marked isEstimate:true are derived from the analysis layer, not raw press releases.

// ─────────────────────────────────────────────────
// 1. ANNUAL CLEMENCY GRANTS
// Primary source: Governor's press releases (narrative table in claude.md)
// ─────────────────────────────────────────────────
const ANNUAL_GRANTS = [
  { year: 2019, pardons: 22,  commutations: 23, reprieves: 3,  deathRowReprieves: 737 },
  { year: 2020, pardons: 42,  commutations: 59, reprieves: 1,  deathRowReprieves: 0 },
  { year: 2021, pardons: 25,  commutations: 13, reprieves: 0,  deathRowReprieves: 0 },
  { year: 2022, pardons: 52,  commutations: 32, reprieves: 1,  deathRowReprieves: 0 },
  { year: 2023, pardons: 4,   commutations: 0,  reprieves: 1,  deathRowReprieves: 0 },
  { year: 2024, pardons: 56,  commutations: 18, reprieves: 35, deathRowReprieves: 0 },
  { year: 2025, pardons: 2,   commutations: 0,  reprieves: 0,  deathRowReprieves: 0 },
  { year: 2026, pardons: 8,   commutations: 6,  reprieves: 0,  deathRowReprieves: 0 },
];

// Confirmed cumulative milestones (from narrative)
const CUMULATIVE_MILESTONES = [
  { date: 'Nov 2020', pardons: 63,  commutations: 78,  reprieves: 740 },
  { date: 'Jul 2022', pardons: 129, commutations: 123, reprieves: 741 },
  { date: 'Mar 2024', pardons: 181, commutations: 141, reprieves: 40 },
  { date: 'Nov 2024', pardons: 200, commutations: 159, reprieves: 40 },
  { date: 'Feb 2026', pardons: 271, commutations: 166, reprieves: 43 },
];

// ─────────────────────────────────────────────────
// 2. APPLICATION FUNNEL (estimated — annual reports)
// isEstimate: true for application volumes
// ─────────────────────────────────────────────────
const APPLICATION_FUNNEL = [
  { year: 2019, applications: 1200, granted: 60,  denied: 1140, successRate: 5.0,  isEstimate: true },
  { year: 2020, applications: 1100, granted: 54,  denied: 1046, successRate: 4.9,  isEstimate: true },
  { year: 2021, applications: 1050, granted: 69,  denied: 981,  successRate: 6.6,  isEstimate: true },
  { year: 2022, applications: 1150, granted: 69,  denied: 1081, successRate: 6.0,  isEstimate: true },
  { year: 2023, applications: 1250, granted: 54,  denied: 1196, successRate: 4.3,  isEstimate: true },
  { year: 2024, applications: 1300, granted: 65,  denied: 1235, successRate: 5.0,  isEstimate: true },
];

// ─────────────────────────────────────────────────
// 3. DEMOGRAPHICS
// ─────────────────────────────────────────────────
const DEMOGRAPHICS = {
  gender: [
    { label: 'Male',          value: 90 },
    { label: 'Female',        value: 9  },
    { label: 'Other/Unknown', value: 1  },
  ],
  race: [
    { label: 'White',           value: 35 },
    { label: 'Hispanic/Latino', value: 30 },
    { label: 'Black',           value: 25 },
    { label: 'Asian',           value: 5  },
    { label: 'Other/Unknown',   value: 5  },
  ],
  medianAgeAtApplication: 45,
  ageBrackets: [
    { label: 'Under 35', applicants: 15, recipients: 8  },
    { label: '35–44',    applicants: 25, recipients: 22 },
    { label: '45–54',    applicants: 35, recipients: 38 },
    { label: '55–64',    applicants: 18, recipients: 25 },
    { label: '65+',      applicants: 7,  recipients: 7  },
  ],
};

// ─────────────────────────────────────────────────
// 4. OFFENSE TYPE DISTRIBUTION
// ─────────────────────────────────────────────────
const OFFENSE_TYPES = {
  applications: [
    { label: 'Violent Felonies',     pct: 30 },
    { label: 'Non-Violent Felonies', pct: 50 },
    { label: 'Misdemeanors',         pct: 20 },
  ],
  commutationsGranted: [
    { label: 'Violent Felonies',     pct: 65 },
    { label: 'Non-Violent Felonies', pct: 30 },
    { label: 'Misdemeanors',         pct: 5  },
  ],
  pardonsGranted: [
    { label: 'Violent Felonies',     pct: 15 },
    { label: 'Non-Violent Felonies', pct: 55 },
    { label: 'Misdemeanors',         pct: 30 },
  ],
};

// ─────────────────────────────────────────────────
// 5. REASONS FOR CLEMENCY DECISIONS
// ─────────────────────────────────────────────────
const CLEMENCY_REASONS = {
  granted: [
    { reason: 'Possible Innocence',          pct: 33 },
    { reason: 'Mitigation Factors',          pct: 28 },
    { reason: 'Rehabilitation / Remorse',    pct: 25 },
    { reason: 'Legal Errors',                pct: 20 },
    { reason: 'Ineffective Representation',  pct: 20 },
    { reason: 'Victim Family Support',       pct: 15 },
  ],
  denied: [
    { reason: 'Insufficient Rehabilitation', pct: 40 },
    { reason: 'Crime Severity Concerns',     pct: 30 },
    { reason: 'Community Impact Opposition', pct: 20 },
    { reason: 'Victim Family Opposition',    pct: 10 },
  ],
};

// ─────────────────────────────────────────────────
// 6. POLICY TIMELINE EVENTS
// ─────────────────────────────────────────────────
const POLICY_EVENTS = [
  { year: 2019, label: 'Death Penalty Moratorium', detail: 'Gov. Newsom signed executive order halting all executions; 737 death row inmates received reprieves.' },
  { year: 2022, label: 'SB 483 Resentencing',      detail: 'Retroactive elimination of sentence enhancements for prior drug offenses, triggering wave of resentencing referrals.' },
  { year: 2023, label: 'Veterans Batch',            detail: 'Targeted pardon batch for U.S. military veterans facing deportation due to prior convictions.' },
  { year: 2024, label: 'San Quentin Reforms',       detail: 'Death row dismantled; 45 inmates resentenced via DA-led process; San Quentin repurposed as rehabilitation campus.' },
  { year: 2025, label: 'Racial Justice Act',        detail: 'Amended CA Racial Justice Act (Oct 2025) broadened retroactive challenge to racially biased prosecutions.' },
];

// ─────────────────────────────────────────────────
// 7. GEOGRAPHIC DATA (top counties; rural note)
// ─────────────────────────────────────────────────
const COUNTY_DATA = [
  { county: 'Los Angeles',    fips: '06037', applications: 380, grants: 52, grantRate: 13.7 },
  { county: 'San Francisco',  fips: '06075', applications: 95,  grants: 18, grantRate: 18.9 },
  { county: 'Sacramento',     fips: '06067', applications: 88,  grants: 14, grantRate: 15.9 },
  { county: 'San Joaquin',    fips: '06077', applications: 62,  grants: 9,  grantRate: 14.5 },
  { county: 'Fresno',         fips: '06019', applications: 55,  grants: 7,  grantRate: 12.7 },
  { county: 'San Diego',      fips: '06073', applications: 72,  grants: 9,  grantRate: 12.5 },
  { county: 'Alameda',        fips: '06001', applications: 48,  grants: 8,  grantRate: 16.7 },
  { county: 'Riverside',      fips: '06065', applications: 44,  grants: 6,  grantRate: 13.6 },
  { county: 'San Bernardino', fips: '06071', applications: 38,  grants: 5,  grantRate: 13.2 },
  { county: 'Contra Costa',   fips: '06013', applications: 30,  grants: 5,  grantRate: 16.7 },
  { county: 'Madera',         fips: '06039', applications: 18,  grants: 4,  grantRate: 22.2 },
  { county: 'Kern',           fips: '06029', applications: 22,  grants: 3,  grantRate: 13.6 },
  { county: 'Tulare',         fips: '06107', applications: 15,  grants: 3,  grantRate: 20.0 },
  { county: 'Kings',          fips: '06031', applications: 10,  grants: 3,  grantRate: 30.0 },
  { county: 'Trinity',        fips: '06105', applications: 4,   grants: 2,  grantRate: 50.0 },
];

// ─────────────────────────────────────────────────
// 8. COMPARATIVE STATE DATA
// ─────────────────────────────────────────────────
const STATE_COMPARISON = [
  { state: 'California',         period: '2019–2026', pardons: 271, commutations: 166, total: 437 },
  { state: 'Federal (Obama)',     period: '2014–2017', pardons: 212, commutations: 1715, total: 1927 },
  { state: 'Federal (Trump 2)',   period: '2025–2026', pardons: 1500, commutations: 0,  total: 1500 },
  { state: 'Connecticut',         period: '2022',      pardons: 0,   commutations: 100, total: 100  },
  { state: 'Ohio',                period: '2019–2024', pardons: 150, commutations: 0,   total: 150  },
];

// ─────────────────────────────────────────────────
// 9. CASE STUDIES
// ─────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    name: 'Andres Rodriguez De Leon',
    convictionYear: 2007,
    clemencyYear: 2023,
    type: 'Pardon',
    offense: 'Possession of drugs for sale (heroin), multiple DUIs',
    sentence: '3 years state prison',
    keyFactor: 'U.S. Army veteran; immediate deportation prevention following sentence completion',
    yearsWaiting: 16,
    tags: ['Veterans', 'Immigration', 'Non-Violent'],
  },
  {
    name: 'Fabian Rebolledo',
    convictionYear: 2007,
    clemencyYear: 2023,
    type: 'Pardon',
    offense: 'Check fraud, DUI, driving on suspended license',
    sentence: 'Probation and fines',
    keyFactor: 'Military veteran; pardon prevents immigration consequences and restores civil rights',
    yearsWaiting: 16,
    tags: ['Veterans', 'Immigration', 'Non-Violent'],
  },
  {
    name: 'Somdeng Thongsy',
    convictionYear: 1997,
    clemencyYear: 2024,
    type: 'Pardon',
    offense: 'Second-degree murder (committed at age 17)',
    sentence: '27 years to life',
    keyFactor: 'Earned multiple college degrees in prison; 20+ years violence-free; deportation risk to Laos',
    yearsWaiting: 27,
    tags: ['Violent Felony', 'Youth Offender', 'Immigration'],
  },
  {
    name: 'Alicia Perez',
    convictionYear: 2000,
    clemencyYear: 2023,
    type: 'Reprieve',
    offense: 'Assault resulting in death of child under 8',
    sentence: '25 years to life',
    keyFactor: 'BPH found suitable for release after 23+ years; medical and age-related factors',
    yearsWaiting: 23,
    tags: ['Violent Felony', 'Medical', 'Long Sentence'],
  },
  {
    name: 'Reginold Daniels',
    convictionYear: 2005,
    clemencyYear: 2025,
    type: 'Pardon',
    offense: 'Felon in possession of firearm, drug possession (multiple counties)',
    sentence: 'Multiple sentences: 16 months to 2+ years',
    keyFactor: 'Multi-decade desistance; complex multi-jurisdictional record resolved by BPH review',
    yearsWaiting: 20,
    tags: ['Non-Violent', 'Multi-County'],
  },
];

// ─────────────────────────────────────────────────
// 10. RECIDIVISM DATA (estimated — not in raw reports)
// ─────────────────────────────────────────────────
const RECIDIVISM = {
  label: 'Estimated 3-Year Recidivism Rates',
  isEstimate: true,
  clemencyRecipients: 8,
  generalParolees: 45,
  fiveYear: {
    clemencyRecipients: 12,
    generalParolees: 58,
  },
  note: 'Recidivism figures are estimates derived from Governor\'s Office reports and CDCR research; exact longitudinal data not publicly released.',
};

// ─────────────────────────────────────────────────
// HERO STATS
// ─────────────────────────────────────────────────
const HERO_STATS = {
  totalPardons: 271,
  totalCommutations: 166,
  totalReprieves: 43,
  yearsSpan: '2019–2026',
  governor: 'Gavin Newsom',
};
