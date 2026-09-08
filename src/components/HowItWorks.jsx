const STEPS = [
  {
    title: 'Enter milestones',
    desc: 'Input amount paid, the promised possession date and actual/current handover status.',
  },
  {
    title: 'Benchmark match',
    desc: 'System auto-selects the applicable SBI highest MCLR for the delay window and adds the statutory 2%.',
  },
  {
    title: 'Compute penalty',
    desc: 'Daily-accrued simple or compounding interest is calculated across the exact delay period.',
  },
  {
    title: "Generate Form 'M'",
    desc: "A state-specific complaint PDF is compiled instantly for filing before the RERA Authority.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Automated pipeline</div>
          <h2>Four steps. No human in the loop.</h2>
          <p>
            The engine cross-references benchmarks, parses your project milestones and compiles a filing-ready
            complaint package automatically.
          </p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.title}>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}