import { rateForDate, STATUTORY_MARGIN } from '../data/rera';
import { delayString } from './format';

const DAY = 86400000;

export function effectiveStart(intent, paymentDate, promisedDate, graceMonths) {
  const graceStart = new Date(promisedDate);
  graceStart.setMonth(graceStart.getMonth() + graceMonths);
  const promisedPlus1 = new Date(promisedDate);
  promisedPlus1.setDate(promisedPlus1.getDate() + 1);

  if (intent === 'refund') {
    return new Date(paymentDate);
  }
  // stay: interest runs from the later of (payment date) or (promised date + grace)
  const floor = new Date(Math.max(graceStart.getTime(), promisedPlus1.getTime()));
  return new Date(Math.max(new Date(paymentDate).getTime(), floor.getTime()));
}

/**
 * Calculate Section 18 delay interest for multi-tranche payments.
 *
 * @param {object} opts
 *   intent        'stay' | 'refund'
 *   mode          'simple' | 'compound'
 *   promisedAt    Date
 *   targetAt      Date
 *   graceMonths   number
 *   mclr          number | null   fixed MCLR, or null for per-phase auto selection
 *   margin        number          statutory margin over MCLR (default 2.0)
 *   tranches      [{ date: Date, amount: number }]
 *
 * @returns computed result with rich breakdown.
 */
export function calculate({ intent, mode, promisedAt, targetAt, graceMonths, mclr = null, margin = STATUTORY_MARGIN, tranches }) {
  const promised = new Date(promisedAt);
  const target = new Date(targetAt);
  const grace = parseInt(graceMonths, 10) || 0;

  let principal = 0;
  let interest = 0;
  const rows = [];

  for (const t of tranches) {
    const amount = parseFloat(t.amount);
    if (!amount || isNaN(amount)) continue;
    principal += amount;

    const start = effectiveStart(intent, t.date, promised, grace);
    const ms = target - start;
    const days = Math.floor(ms / DAY);
    if (days <= 0) {
      rows.push({ date: t.date, amount, start, days: 0, rate: 0, interest: 0, applicableRate: null });
      continue;
    }

    const annualRate = (mclr != null ? parseFloat(mclr) : rateForDate(mclrAutoDate(intent, start, promised, grace))) + margin;

    let rowInterest = 0;
    if (mode === 'compound') {
      const months = days / 30.4375;
      const mRate = annualRate / 100 / 12;
      rowInterest = amount * (Math.pow(1 + mRate, months) - 1);
    } else {
      rowInterest = (amount * (annualRate / 100) * days) / 365;
    }
    interest += rowInterest;
    rows.push({ date: t.date, amount, start, days, rate: annualRate, interest: rowInterest });
  }

  const totalDays = rows.reduce((a, r) => a + r.days, 0);
  const weightedRate = rows.length
    ? rows.reduce((a, r) => a + (r.days === 0 ? 0 : r.rate * r.days), 0) /
      (rows.reduce((a, r) => a + r.days, 0) || 1)
    : 0;
  const grand = principal + interest;
  const delay = delayString(intent === 'refund' ? 0 : Math.max(0, Math.floor((target - promised) / DAY)));

  return { principal, interest, grand, rows, totalDays, weightedRate, delay, intent, mode };
}

function mclrAutoDate(intent, start, promised, grace) {
  if (intent === 'refund') return start;
  const g = new Date(promised);
  g.setMonth(g.getMonth() + (grace || 0));
  return new Date(Math.max(g.getTime(), new Date(promised).getTime() + DAY));
}