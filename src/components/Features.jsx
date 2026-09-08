const FEATURES = [
  {
    ic: '📊',
    title: 'SBI MCLR historical engine',
    desc: 'A maintained ledger of the State Bank of India highest Marginal Cost of Lending Rate, mapped to each effective date so the correct benchmark is applied for every phase of your delay.',
    span: 2,
  },
  {
    ic: '🧮',
    title: 'Compounding logic',
    desc: 'Toggle between statutory simple interest and monthly-compounding scenarios.',
    span: 1,
  },
  {
    ic: '📄',
    title: "Form 'M' PDF",
    desc: 'Professionally formatted, printable complaint generated in-browser.',
    span: 1,
  },
  {
    ic: '🗺️',
    title: 'State-specific',
    desc: 'Adapts headers and authority references to your State RERA.',
    span: 1,
  },
  {
    ic: '🔒',
    title: 'Private by design',
    desc: 'All computation runs locally in your browser. Nothing is uploaded.',
    span: 1,
  },
  {
    ic: '⚡',
    title: 'Zero administrative intervention',
    desc: 'From the moment you enter your figures to the final downloadable PDF package, the workflow is entirely self-service — no case worker, no queue, no manual review.',
    span: 2,
  },
];

export default function Features() {
  return (
    <section style={{ background: 'var(--surface-2)' }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Platform capabilities</div>
          <h2>Everything a distressed homebuyer needs</h2>
        </div>
        <div className="bento">
          {FEATURES.map((f) => (
            <div className={'card' + (f.span === 2 ? ' span2' : '')} key={f.title}>
              <div className="ic">{f.ic}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}