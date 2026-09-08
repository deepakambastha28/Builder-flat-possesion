import { describe, it, expect } from 'vitest';
import { inr, inrFull, fmtDate, toInputDate, delayString } from './format';
import { rateForDate, MCLR } from '../data/rera';

describe('inr', () => {
  it('formats with Indian locale grouping and rupee symbol', () => {
    expect(inr(4500000)).toBe('₹45,00,000');
    expect(inr(1058)).toBe('₹1,058');
  });
});

describe('inrFull', () => {
  it('pads to two decimals', () => {
    expect(inrFull(12345.5)).toBe('₹12,345.50');
  });
});

describe('fmtDate', () => {
  it('formats a date in en-IN short style', () => {
    const out = fmtDate(new Date('2022-06-30'));
    expect(out).toMatch(/Jun|June/);
    expect(out).toContain('2022');
  });
});

describe('toInputDate', () => {
  it('renders yyyy-mm-dd for input values', () => {
    expect(toInputDate(new Date('2022-06-30'))).toBe('2022-06-30');
    expect(toInputDate(new Date('2022-01-05'))).toBe('2022-01-05');
  });
});

describe('delayString', () => {
  it('formats years and months', () => {
    expect(delayString(730).short).toBe('1y 11m');
    expect(delayString(730).long).toBe('1y 11m (730 days)');
  });
  it('handles zero days', () => {
    expect(delayString(0).short).toBe('0m');
  });
});

describe('rateForDate', () => {
  it('returns the latest rate for a recent date', () => {
    const latest = rateForDate(new Date('2026-06-01'));
    expect(latest).toBe(MCLR[MCLR.length - 1].rate);
  });
  it('falls back to the first rate before the ledger', () => {
    expect(rateForDate(new Date('2001-01-01'))).toBe(MCLR[0].rate);
  });
});