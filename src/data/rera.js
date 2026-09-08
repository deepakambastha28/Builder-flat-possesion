export const MCLR = [
  { date: '2016-04-01', rate: 9.2 },
  { date: '2017-01-01', rate: 8.0 },
  { date: '2018-03-01', rate: 8.15 },
  { date: '2019-01-10', rate: 8.55 },
  { date: '2019-10-10', rate: 8.05 },
  { date: '2020-05-10', rate: 7.25 },
  { date: '2021-01-10', rate: 7.0 },
  { date: '2022-04-15', rate: 7.1 },
  { date: '2022-11-15', rate: 8.05 },
  { date: '2023-06-15', rate: 8.55 },
  { date: '2024-01-15', rate: 8.75 },
  { date: '2024-08-15', rate: 8.95 },
  { date: '2025-01-15', rate: 9.0 },
  { date: '2025-08-15', rate: 8.9 },
  { date: '2026-02-15', rate: 8.85 },
];

export const STATUTORY_MARGIN = 2.0;

export function rateForDate(target) {
  const t = new Date(target).getTime();
  let match = MCLR[0];
  for (const m of MCLR) {
    if (new Date(m.date).getTime() <= t) match = m;
    else break;
  }
  return match.rate;
}

export const STATES = [
  { label: 'Maharashtra (MahaRERA)', authority: 'Maharashtra Real Estate Regulatory Authority' },
  { label: 'Karnataka (K-RERA)', authority: 'Karnataka Real Estate Regulatory Authority' },
  { label: 'Uttar Pradesh (UP-RERA)', authority: 'Uttar Pradesh Real Estate Regulatory Authority' },
  { label: 'Haryana (HRERA)', authority: 'Haryana Real Estate Regulatory Authority' },
  { label: 'Tamil Nadu (TNRERA)', authority: 'Tamil Nadu Real Estate Regulatory Authority' },
  { label: 'Telangana (TS-RERA)', authority: 'Telangana Real Estate Regulatory Authority' },
  { label: 'Delhi (RERA Delhi)', authority: 'Delhi Real Estate Regulatory Authority' },
  { label: 'Gujarat (GujRERA)', authority: 'Gujarat Real Estate Regulatory Authority' },
  { label: 'West Bengal (WBHIRA)', authority: 'West Bengal Housing Industry Regulatory Authority' },
  { label: 'Rajasthan (RJ-RERA)', authority: 'Rajasthan Real Estate Regulatory Authority' },
];