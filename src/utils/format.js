export const inr = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

export const inrFull = (n) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const toInputDate = (d) => {
  const dt = new Date(d);
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${mm}-${dd}`;
};

export const delayString = (days) => {
  const dm = Math.floor(days / 30.4375);
  const yy = Math.floor(dm / 12);
  const mm = dm % 12;
  const short = (yy > 0 ? yy + 'y ' : '') + mm + 'm';
  return { short, long: (yy > 0 ? yy + 'y ' : '') + mm + 'm (' + days + ' days)' };
};