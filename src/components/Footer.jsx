export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="brand">
              <span className="mark">⚖️</span>{' '}
              <span>
                Possession<span style={{ color: 'var(--brand)' }}>Pro</span>
              </span>
            </div>
            <p className="disc">
              <b>Disclaimer:</b> PossessionPro is an automated computational and document-drafting tool. It does not
              constitute legal advice, does not create an advocate–client relationship, and does not represent SBI, any
              State RERA Authority or the Government of India. MCLR values shown are indicative. Interest computations
              follow the widely-adopted "SBI highest MCLR + 2%" standard under State RERA Rules and Section 18 of the
              Real Estate (Regulation and Development) Act, 2016. Verify all figures and consult a qualified advocate
              before filing.
            </p>
          </div>
          <div className="foot-links">
            <div>
              <h5>Platform</h5>
              <a href="#how">How it works</a>
              <a href="#calculator">Calculator</a>
              <a href="#mclr">MCLR ledger</a>
              <a href="#formm">Form 'M'</a>
            </div>
            <div>
              <h5>Resources</h5>
              <a href="#how">RERA Act, 2016</a>
              <a href="#how">Section 18 explained</a>
              <a href="#mclr">State authorities</a>
            </div>
          </div>
        </div>
        <div className="copy">© 2026 PossessionPro · Built for Indian homebuyers · This is a prototype demonstration.</div>
      </div>
    </footer>
  );
}