# PossessionPro — RERA Sec. 18 Delay Interest & Form 'M' Engine

Automated RERA Section 18 delayed-possession interest calculator with SBI MCLR benchmarking, multi-tranche payment support, stay-vs-refund strategies and state-specific Form 'M' complaint PDF generation.

## Features

- **Section 18 interest calculator** — computes delay interest at the statutory SBI highest MCLR + 2% basis
- **Multi-tranche payment history** — add every instalment with its payment date; interest accrues per tranche
- **Stay vs Refund strategies** — toggle between claiming delay penalty (stay) or full refund with interest from each payment date
- **Simple / monthly-compounding modes** — statutory simple interest or an illustrative compounding scenario
- **SBI MCLR historical ledger** — click any row to load that benchmark into the calculator
- **Form 'M' PDF generator** — compiles a professionally formatted, state-specific complaint PDF in-browser (jsPDF)
- **Private by design** — all computation runs locally in the browser; nothing is uploaded

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) 18
- [jsPDF](https://github.com/parallax/jsPDF) for in-browser PDF generation

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Testing

The project ships with three layers of automated testing.

### 1. Unit tests (Vitest)

Covers the calculation engine (`calculate`, `effectiveStart`) and formatting helpers.

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

### 2. Component / UI tests (Vitest + React Testing Library)

Renders the full `App` in a jsdom environment and verifies the calculator math, strategy/mode toggling, multi-tranche handling, MCLR-ledger loading and theme switching.

```bash
npm run test
```

### 3. End-to-end tests (Playwright)

Runs against a live dev server in headless Chromium and Firefox, verifying page load, live computation, toggles, PDF download, and theme persistence.

```bash
# install browsers (once)
npx playwright install

# run e2e
npm run test:e2e
```

Run the full suite (unit + component + e2e):

```bash
npm run test:all
```

Test reports (unit/component + Playwright HTML) are written to `coverage/`, `test-results/` and `playwright-report/` (gitignored).

## Project Structure

```
src/
  components/   UI components (Nav, Hero, Calculator, MCLR table, Form M, Footer)
  data/         SBI MCLR ledger, State RERA authority list
  utils/        Calculation engine, formatters, jsPDF Form 'M' generator
  test/         Vitest setup (matchMedia, scrollIntoView shims)
  App.jsx       State owner & page composition
  index.css     Global light/dark theme styles
tests/
  e2e/          Playwright end-to-end specs
```

## Disclaimer

PossessionPro is an automated computational and document-drafting tool. It does not constitute legal advice and does not represent SBI, any State RERA Authority, or the Government of India. MCLR values shown are indicative. Verify all figures and consult a qualified advocate before filing.

## License

This is a prototype demonstration.