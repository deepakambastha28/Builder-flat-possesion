import { useEffect, useMemo, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Calculator from './components/Calculator';
import MclrTable from './components/MclrTable';
import FormM from './components/FormM';
import Footer from './components/Footer';
import { MCLR, STATUTORY_MARGIN } from './data/rera';
import { calculate } from './utils/calc';
import { generateFormM } from './utils/pdf';

const toInputDate = (d) => d.toISOString().slice(0, 10);

const initialState = {
  intent: 'stay',
  mode: 'simple',
  promised: '2022-06-30',
  target: toInputDate(new Date()),
  grace: '0',
  mclr: String(MCLR[MCLR.length - 1].rate),
  margin: STATUTORY_MARGIN.toFixed(2),
  tranches: [{ id: 1, date: '2021-06-01', amount: '4500000' }],
};

const initialForm = {
  name: '',
  addr: '',
  builder: '',
  project: '',
  unit: '',
  state: 'Karnataka (K-RERA)',
  facts: '',
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [state, setState] = useState(initialState);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const result = useMemo(() => {
    const tranches = state.tranches
      .map((t) => ({ date: new Date(t.date), amount: parseFloat(t.amount) }))
      .filter((t) => !isNaN(t.date.getTime()) && !isNaN(t.amount) && t.amount > 0);

    if (!state.promised || !state.target || tranches.length === 0) {
      return { principal: 0, interest: 0, grand: 0, rows: [], weightedRate: 0, delay: null, intent: state.intent, mode: state.mode };
    }
    return calculate({
      intent: state.intent,
      mode: state.mode,
      promisedAt: new Date(state.promised),
      targetAt: new Date(state.target),
      graceMonths: parseInt(state.grace, 10) || 0,
      mclr: state.mclr === '' ? null : parseFloat(state.mclr),
      margin: parseFloat(state.margin) || 0,
      tranches,
    });
  }, [state]);

  const selectMclrRate = (rate) => {
    setState((s) => ({ ...s, mclr: String(rate) }));
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateFormM = () => {
    generateFormM({
      stateLabel: form.state,
      name: form.name,
      addr: form.addr,
      builder: form.builder,
      project: form.project,
      unit: form.unit,
      facts: form.facts,
      result: {
        ...result,
        promised: new Date(state.promised),
        target: new Date(state.target),
      },
    });
  };

  return (
    <>
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <HowItWorks />
      <Features />
      <Calculator state={state} setState={setState} result={result} />
      <MclrTable onSelect={selectMclrRate} />
      <FormM form={form} setForm={setForm} onGenerate={handleGenerateFormM} />
      <Footer />
    </>
  );
}