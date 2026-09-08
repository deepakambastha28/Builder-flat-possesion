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

## Project Structure

```
src/
  components/   UI components (Nav, Hero, Calculator, MCLR table, Form M, Footer)
  data/         SBI MCLR ledger, State RERA authority list
  utils/        Calculation engine, formatters, jsPDF Form 'M' generator
  App.jsx       State owner & page composition
  index.css     Global light/dark theme styles
```

## Disclaimer

PossessionPro is an automated computational and document-drafting tool. It does not constitute legal advice and does not represent SBI, any State RERA Authority, or the Government of India. MCLR values shown are indicative. Verify all figures and consult a qualified advocate before filing.

## License

This is a prototype demonstration.