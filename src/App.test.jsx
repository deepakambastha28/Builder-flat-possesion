import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { MCLR } from './data/rera';

const DEFAULT_AMOUNT = 4500000;

describe('PossessionPro app', () => {
  it('renders brand, hero and main sections', () => {
    render(<App />);
    expect(screen.getAllByText(/PossessionPro/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Reclaim your/i)).toBeInTheDocument();
    expect(screen.getByText(/SBI highest MCLR — historical reference/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto-compile your Form 'M'/i)).toBeInTheDocument();
  });

  const bigValue = () => document.querySelector('.result-hero .big').textContent;

  it('computes simple interest and matches reference math', () => {
    render(<App />);
    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[1], { target: { value: '2024-06-30' } });

    expect(bigValue()).toBe('₹9,76,500');
    expect(document.querySelector('.result-hero').textContent).toContain('₹9,76,500');
    expect(screen.getByText('₹54,76,500')).toBeInTheDocument(); // grand total
  });

  it('toggles monthly compounding and shows higher interest', () => {
    render(<App />);
    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[1], { target: { value: '2024-06-30' } });

    expect(bigValue()).toBe('₹9,76,500');

    fireEvent.click(screen.getByText('Monthly compounding'));
    expect(bigValue()).not.toBe('₹9,76,500');
    // compound on 45L at 10.85% for 24 months
    const months = 730 / 30.4375;
    const expected = Math.round(DEFAULT_AMOUNT * (Math.pow(1 + 0.1085 / 12, months) - 1));
    const shown = expected.toLocaleString('en-IN');
    expect(bigValue()).toBe(`₹${shown}`);
  });

  it('switch to refund mode grows interest from each payment date', () => {
    render(<App />);
    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[1], { target: { value: '2024-06-30' } });

    fireEvent.click(screen.getByText(/💸 Exit · Full refund/));
    // payment 2021-06-01 -> 2024-06-30 = 1125 days
    const expected = Math.round((DEFAULT_AMOUNT * 0.1085 * 1125) / 365);
    const shown = expected.toLocaleString('en-IN');
    expect(bigValue()).toBe(`₹${shown}`);
    expect(screen.getByText('Total refund + interest')).toBeInTheDocument();
  });

  it('adds and removes payment milestones', () => {
    render(<App />);
    const rowsBefore = document.querySelectorAll('.tranche-row').length;
    expect(rowsBefore).toBe(1);

    fireEvent.click(screen.getByText(/➕ Add payment milestone/));
    expect(document.querySelectorAll('.tranche-row').length).toBe(2);

    const removeButtons = screen.getAllByTitle('Remove');
    fireEvent.click(removeButtons[1]);
    expect(document.querySelectorAll('.tranche-row').length).toBe(1);
  });

  it('uses latest SBI MCLR suggestion button', () => {
    render(<App />);
    const mclrInput = document.querySelectorAll('input[type="number"]')[1];
    expect(Number(mclrInput.value)).toBe(MCLR[MCLR.length - 1].rate);
    fireEvent.click(screen.getByText(`↻ Use latest SBI MCLR (${MCLR[MCLR.length - 1].rate}%)`));
    expect(Number(mclrInput.value)).toBe(MCLR[MCLR.length - 1].rate);
  });

  it('clicking an MCLR ledger row loads that rate into the calculator', () => {
    render(<App />);
    const target = MCLR[5];
    const row = screen.getByRole('row', { name: new RegExp(target.rate.toFixed(2)) });
    fireEvent.click(row);
    const mclrInput = document.querySelectorAll('input[type="number"]')[1];
    expect(Number(mclrInput.value)).toBe(target.rate);
  });

  it('toggles light/dark theme on the html element', () => {
    render(<App />);
    const html = document.documentElement;
    expect(html.getAttribute('data-theme')).toBe('light');
    fireEvent.click(screen.getByTitle('Toggle theme'));
    expect(html.getAttribute('data-theme')).toBe('dark');
    fireEvent.click(screen.getByTitle('Toggle theme'));
    expect(html.getAttribute('data-theme')).toBe('light');
  });

  it('renders Form M section with state authorities', () => {
    render(<App />);
    const formPanel = screen.getByText(/Complaint generator/i).closest('section');
    expect(formPanel).not.toBeNull();
    expect(within(formPanel).getByText(/Karnataka/)).toBeInTheDocument();
    expect(screen.getByText(/Generate Form 'M' PDF/)).toBeInTheDocument();
  });
});