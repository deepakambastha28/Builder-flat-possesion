import { STATES } from '../data/rera';

export default function FormM({ form, setForm, onGenerate }) {
  const set = (key) => (ev) => setForm({ ...form, [key]: ev.target.value });

  return (
    <section id="formm">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Complaint generator</div>
          <h2>Auto-compile your Form 'M' complaint</h2>
          <p>
            Fill your particulars, then generate a formatted, filing-ready PDF. Your calculated penalty is embedded
            automatically.
          </p>
        </div>
        <div className="formm">
          <div className="fm-grid">
            <div className="field">
              <label>Complainant full name</label>
              <input placeholder="e.g. Ramesh Kumar Sharma" value={form.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label>Complainant address</label>
              <input placeholder="Flat / house, city, PIN" value={form.addr} onChange={set('addr')} />
            </div>
            <div className="field">
              <label>Respondent (Promoter / Builder)</label>
              <input placeholder="e.g. ABC Developers Pvt. Ltd." value={form.builder} onChange={set('builder')} />
            </div>
            <div className="field">
              <label>Project name &amp; RERA Reg. No.</label>
              <input placeholder="e.g. Green Meadows, PRM/KA/RERA/..." value={form.project} onChange={set('project')} />
            </div>
            <div className="field">
              <label>Unit / Flat number</label>
              <input placeholder="e.g. Tower B, Flat 1204" value={form.unit} onChange={set('unit')} />
            </div>
            <div className="field">
              <label>State RERA Authority</label>
              <select value={form.state} onChange={set('state')}>
                {STATES.map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Relief / facts (optional, auto-drafted if left blank)</label>
            <input
              placeholder="Brief statement of delay and relief sought"
              value={form.facts}
              onChange={set('facts')}
            />
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: 8 }}>
            <button className="btn btn-primary" onClick={onGenerate}>
              📄 Generate Form 'M' PDF
            </button>
          </div>
          <div className="muted-note">
            This produces a professionally formatted draft based on Form 'M' (complaint to the Adjudicating
            Officer/Authority) under the RERA Rules. It is a self-help draft, not legal advice — have it reviewed by an
            advocate before filing.
          </div>
        </div>
      </div>
    </section>
  );
}