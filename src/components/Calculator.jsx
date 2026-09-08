import { MCLR, STATUTORY_MARGIN } from '../data/rera';
import { inr, fmtDate } from '../utils/format';

const toToday = () => new Date().toISOString().slice(0, 10);

export default function Calculator({ state, setState, result }) {
  const set = (key) => (ev) => setState({ ...state, [key]: ev.target.value });

  const setTranche = (id, key) => (ev) =>
    setState({
      ...state,
      tranches: state.tranches.map((t) => (t.id === id ? { ...t, [key]: ev.target.value } : t)),
    });

  const addTranche = () =>
    setState({ ...state, tranches: [...state.tranches, { id: Date.now(), date: '', amount: '' }] });

  const removeTranche = (id) =>
    setState({ ...state, tranches: state.tranches.filter((t) => t.id !== id) });

  const suggestLatestMclr = () => setState({ ...state, mclr: String(MCLR[MCLR.length - 1].rate) });

  const today = toToday();

  return (
    <section id="calculator">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Interest calculator</div>
          <h2>Compute your Section 18 penalty</h2>
          <p>Enter your details below. The applicable SBI MCLR is auto-suggested but fully editable.</p>
        </div>

        <div className="calc-wrap">
          {/* INPUT */}
          <div className="panel">
            <h3>Your project details</h3>
            <div className="sub">All fields are required for an accurate computation.</div>

            {/* Legal strategy */}
            <div className="toggle-row" style={{ marginBottom: 8 }}>
              <button className={state.intent === 'stay' ? 'active' : ''} onClick={() => setState({ ...state, intent: 'stay' })}>
                🏠 Stay · Claim penalty
              </button>
              <button className={state.intent === 'refund' ? 'active' : ''} onClick={() => setState({ ...state, intent: 'refund' })}>
                💸 Exit · Full refund
              </button>
            </div>
            <p className="muted-note" style={{ marginTop: 0, marginBottom: 18, padding: '10px 12px' }}>
              {state.intent === 'refund'
                ? 'Refund mode: interest runs on each payment from its payment date (full exit under Sec. 18).'
                : 'Stay mode: interest runs on each payment from the promised possession date (plus grace).'}
            </p>

            {/* Interest method */}
            <div className="toggle-row">
              <button className={state.mode === 'simple' ? 'active' : ''} onClick={() => setState({ ...state, mode: 'simple' })}>
                Simple interest (statutory)
              </button>
              <button className={state.mode === 'compound' ? 'active' : ''} onClick={() => setState({ ...state, mode: 'compound' })}>
                Monthly compounding
              </button>
            </div>

            <div className="row2">
              <div className="field">
                <label>Promised possession date</label>
                <input type="date" value={state.promised} onChange={set('promised')} />
              </div>
              <div className="field">
                <label>Actual / current date</label>
                <input type="date" value={state.target} max={today ? undefined : undefined} onChange={set('target')} />
              </div>
            </div>

            <div className="row2">
              <div className="field">
                <label>
                  Grace period <span className="hint">(months)</span>
                </label>
                <input type="number" min="0" value={state.grace} onChange={set('grace')} />
              </div>
              <div className="field">
                <label>
                  SBI highest MCLR <span className="hint">(%)</span>
                </label>
                <input type="number" step="0.01" value={state.mclr === '' ? '' : state.mclr} onChange={set('mclr')} />
              </div>
            </div>

            <div className="field">
              <label>
                Statutory margin over MCLR <span className="hint">(%)</span>
              </label>
              <input type="number" step="0.01" value={state.margin} onChange={set('margin')} />
            </div>

            {/* Tranches */}
            <div className="field">
              <label>Financial payment history (tranches)</label>
              <div className="tranche-list">
                {state.tranches.map((t, i) => (
                  <div className="tranche-row" key={t.id}>
                    <input type="date" value={t.date} onChange={setTranche(t.id, 'date')} />
                    <div style={{ width: '100%' }}>
                      <input type="number" min="1" placeholder={i === 0 ? 'Principal paid (₹)' : 'Next instalment (₹)'} value={t.amount} onChange={setTranche(t.id, 'amount')} />
                    </div>
                    <div className="del">
                      <button type="button" onClick={() => removeTranche(t.id)} disabled={state.tranches.length === 1} title="Remove">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="add-btn" onClick={addTranche}>
                ➕ Add payment milestone
              </button>
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <button type="button" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px dashed var(--line)', background: 'var(--surface-2)' }} onClick={suggestLatestMclr}>
                ↻ Use latest SBI MCLR ({MCLR[MCLR.length - 1].rate}%)
              </button>
            </div>

            <p className="muted-note" style={{ marginTop: 8 }}>
              ⚠️ Enter principal amounts only — exclude GST, registration costs and stamp duty.
            </p>
          </div>

          {/* OUTPUT */}
          <div className="panel">
            <h3>Your recoverable interest</h3>
            <div className="sub">Computed live from your inputs.</div>
            <div className="result-hero">
              <div className="lbl">{result.intent === 'refund' ? 'Total refund + interest' : 'Total interest recoverable'}</div>
              <div className="big">{result.interest ? inr(result.interest) : inr(0)}</div>
              <div className="split">
                <div>Rate applied: <b>{result.weightedRate ? result.weightedRate.toFixed(2) + '%' : '—'}</b></div>
                <div>Tranches: <b>{result.rows.length}</b></div>
              </div>
            </div>
            <div className="rbreak"><span>Principal (amount paid)</span><b>{inr(result.principal)}</b></div>
            <div className="rbreak"><span>Accrued interest</span><b>{inr(result.interest)}</b></div>
            <div className="rbreak"><span>Grand total (principal + interest)</span><b>{inr(result.grand)}</b></div>
            <div className="rbreak">
              <span>Delay (stay mode)<span className="pill">{result.mode === 'simple' ? 'Simple' : 'Compound'}</span></span>
              <b>{result.delay ? result.delay.short : '—'}</b>
            </div>
            <div className="rbreak"><span>Applicable annual rate</span><b>{result.weightedRate ? result.weightedRate.toFixed(2) + '% (MCLR + ' + state.margin + '%)' : '0%'}</b></div>

            {result.rows.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink-soft)', marginBottom: 8 }}>
                  Tranche breakdown
                </h4>
                {result.rows.map((r, i) => (
                  <div className="rbreak" key={i}>
                    <span>{fmtDate(r.date)} · {inr(r.amount)}</span>
                    <b style={{ color: 'var(--accent)' }}>{r.days > 0 ? inr(r.interest) + ' (' + r.days + 'd)' : '—'}</b>
                  </div>
                ))}
              </div>
            )}

            <div className="muted-note">
              {result.intent === 'refund'
                ? 'Under refund claims, interest is computed from the date of each payment (Section 18). Verify your State RERA Rules and the current SBI highest MCLR before filing.'
                : 'Under most State RERA Rules the prescribed rate is the SBI highest MCLR + 2%. Statutory interest is generally simple; the compounding option is provided for negotiation/illustration. Verify the current MCLR and your state\'s rule before filing.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}