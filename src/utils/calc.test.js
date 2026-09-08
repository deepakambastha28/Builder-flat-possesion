import { describe, it, expect } from 'vitest';
import { calculate, effectiveStart } from './calc';

// 2022-06-30 -> 2024-06-30 is 730 days (exactly two years)
const PROMISED = new Date('2022-06-30');
const TARGET = new Date('2024-06-30');

const tranche = (date, amount) => ({ date: new Date(date), amount });

describe('effectiveStart', () => {
  it('refund mode: starts from payment date', () => {
    const d = effectiveStart('refund', new Date('2021-01-01'), PROMISED, 0);
    expect(d.toISOString()).toBe('2021-01-01T00:00:00.000Z');
  });

  it('stay mode: starts from promised date + 1 day floor, ignoring earlier payments', () => {
    const d = effectiveStart('stay', new Date('2021-01-01'), PROMISED, 0);
    expect(d.toISOString()).toBe('2022-07-01T00:00:00.000Z');
  });

  it('stay mode: starts from payment date if payment was after promised date', () => {
    const d = effectiveStart('stay', new Date('2023-01-15'), PROMISED, 0);
    expect(d.toISOString()).toBe('2023-01-15T00:00:00.000Z');
  });

  it('stay mode: applies grace period in months', () => {
    const d = effectiveStart('stay', new Date('2021-01-01'), PROMISED, 6);
    expect(d.toISOString()).toBe('2022-12-30T00:00:00.000Z');
  });
});

describe('calculate — simple interest', () => {
  it('computes simple interest across the delay window', () => {
    const r = calculate({
      intent: 'stay',
      mode: 'simple',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 8.0,
      margin: 2.0,
      tranches: [tranche('2021-01-01', 100000)],
    });
    // start 2022-07-01, delay 730 days, annual rate 10%
    expect(r.principal).toBe(100000);
    expect(r.rows[0].days).toBe(730);
    expect(r.interest).toBeCloseTo((100000 * 0.1 * 730) / 365, 2);
    expect(r.grand).toBeCloseTo(100000 + (100000 * 0.1 * 730) / 365, 2);
    expect(r.weightedRate).toBeCloseTo(10.0, 2);
  });

  it('aggregates multiple tranches independently', () => {
    const r = calculate({
      intent: 'refund',
      mode: 'simple',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 8.0,
      margin: 2.0,
      tranches: [tranche('2023-01-01', 100000), tranche('2024-01-01', 50000)],
    });
    // tranche 1: 2023-01-01 -> 2024-06-30 = 546 days; tranche 2: 2024-01-01 -> 2024-06-30 = 181 days
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0].days).toBe(546);
    expect(r.rows[1].days).toBe(181);
    const expected =
      (100000 * 0.1 * 546) / 365 + (50000 * 0.1 * 181) / 365;
    expect(r.interest).toBeCloseTo(expected, 2);
    expect(r.principal).toBe(150000);
  });

  it('skips tranches whose delay window is in the future', () => {
    const r = calculate({
      intent: 'stay',
      mode: 'simple',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 8.0,
      margin: 2.0,
      tranches: [tranche('2025-01-01', 100000)],
    });
    expect(r.rows[0].days).toBe(0);
    expect(r.interest).toBe(0);
  });
});

describe('calculate — monthly compounding', () => {
  it('compounds monthly across the delay window', () => {
    const r = calculate({
      intent: 'stay',
      mode: 'compound',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 10.0,
      margin: 2.0,
      tranches: [tranche('2021-01-01', 100000)],
    });
    // start 2022-07-01, 730 days -> months = 730/30.4375 = 23.983...
    const months = 730 / 30.4375;
    const mRate = 12 / 100 / 12;
    expect(r.interest).toBeCloseTo(100000 * (Math.pow(1 + mRate, months) - 1), 2);
  });

  it('compound interest always exceeds simple at same rate', () => {
    const base = {
      intent: 'stay',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 8.0,
      margin: 2.0,
      tranches: [tranche('2021-01-01', 100000)],
    };
    const simple = calculate({ ...base, mode: 'simple' });
    const compound = calculate({ ...base, mode: 'compound' });
    expect(compound.interest).toBeGreaterThan(simple.interest);
  });
});

describe('calculate — auto MCLR selection', () => {
  it('auto-selects the MCLR effective on the delay start date when mclr is null', () => {
    const r = calculate({
      intent: 'stay',
      mode: 'simple',
      promisedAt: new Date('2018-03-01'),
      targetAt: new Date('2019-03-01'),
      graceMonths: 0,
      mclr: null,
      margin: 2.0,
      tranches: [tranche('2018-01-01', 100000)],
    });
    // delay starts 2018-03-02 -> MCLR 8.15 effective 2018-03-01
    expect(r.weightedRate).toBeCloseTo(8.15 + 2, 2);
  });
});

describe('calculate — inputs validation', () => {
  it('handles empty tranches', () => {
    const r = calculate({
      intent: 'stay',
      mode: 'simple',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 8.0,
      margin: 2.0,
      tranches: [],
    });
    expect(r.principal).toBe(0);
    expect(r.interest).toBe(0);
  });

  it('handles zero margin', () => {
    const r = calculate({
      intent: 'stay',
      mode: 'simple',
      promisedAt: PROMISED,
      targetAt: TARGET,
      graceMonths: 0,
      mclr: 8.0,
      margin: 0,
      tranches: [tranche('2021-01-01', 100000)],
    });
    expect(r.weightedRate).toBeCloseTo(8.0, 2);
  });
});