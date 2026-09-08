import { MCLR } from '../data/rera';
import { fmtDate } from '../utils/format';

export default function MclrTable({ onSelect }) {
  const rows = [...MCLR].reverse();
  return (
    <section id="mclr" style={{ background: 'var(--surface-2)' }}>
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Benchmark ledger</div>
          <h2>SBI highest MCLR — historical reference</h2>
          <p>Indicative 1-year MCLR values. Click any row to load that rate into the calculator.</p>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Effective from</th>
                <th>SBI 1-yr MCLR</th>
                <th>+ 2% margin</th>
                <th>Effective RERA rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr
                  key={m.date}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelect(m.rate)}
                  title="Load this rate into the calculator"
                >
                  <td>{fmtDate(m.date)}</td>
                  <td className="rate">{m.rate.toFixed(2)}%</td>
                  <td>+2.00%</td>
                  <td className="eff">{(m.rate + 2).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: 14 }}>
          Figures are indicative and rounded for planning. Always confirm the exact published rate on the SBI website
          for your period.
        </p>
      </div>
    </section>
  );
}