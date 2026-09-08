import { inr } from '../utils/format';

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="badge">● Zero-manpower · Fully automated</span>
          <h1>
            Reclaim your <span>delayed-possession interest</span> under RERA Section 18.
          </h1>
          <p className="lead">
            An end-to-end, self-serve platform that computes compounding delay penalties against official SBI MCLR
            benchmarks and auto-drafts a legally-formatted, state-specific <b>Form 'M'</b> complaint — as a ready-to-file
            PDF, no administrator required.
          </p>
          <div className="hero-cta">
            <a href="#calculator">
              <button className="btn btn-primary">Calculate my penalty →</button>
            </a>
            <a href="#how">
              <button className="btn btn-ghost">See how it works</button>
            </a>
          </div>
          <div className="hero-stats">
            <div className="s">
              <b>MCLR + 2%</b>
              <span>Prescribed statutory rate</span>
            </div>
            <div className="s">
              <b>Sec. 18</b>
              <span>RERA Act, 2016</span>
            </div>
            <div className="s">
              <b>&lt; 60 sec</b>
              <span>From input to filed PDF</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <h4>Live estimate preview</h4>
          <div className="mini-row">
            <span>Amount paid to builder</span>
            <span>₹45,00,000</span>
          </div>
          <div className="mini-row">
            <span>Delay period</span>
            <span>26 months</span>
          </div>
          <div className="mini-row">
            <span>Applicable rate (MCLR+2%)</span>
            <span>10.85%</span>
          </div>
          <div className="mini-row">
            <span>Interest recoverable</span>
            <b>{inr(1058000)}</b>
          </div>
          <div className="muted-note" style={{ marginTop: 14 }}>
            Illustrative only. Scroll to the calculator for your exact figure.
          </div>
        </div>
      </div>
    </section>
  );
}