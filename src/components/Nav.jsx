export default function Nav({ theme, toggleTheme }) {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <div className="brand">
          <span className="mark">⚖️</span>{' '}
          <span>
            Possession<span style={{ color: 'var(--brand)' }}>Pro</span>
          </span>
        </div>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#calculator">Calculator</a>
          <a href="#mclr">SBI MCLR</a>
          <a href="#formm">Form 'M'</a>
          <a href="#calculator" className="cta">
            <button className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
              Calculate now
            </button>
          </a>
          <button className="tbtn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}