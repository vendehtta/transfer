// Root app — sidebar nav + screen switching + Tweaks panel
const { useState: useS, useEffect: useE } = React;

const NAV = [
  { id: 'today',     label: 'Today',      glyph: '本', badge: '·' },
  { id: 'cards',     label: 'Cards',      glyph: '札', badge: 'SRS' },
  { id: 'kanji',     label: 'Kanji',      glyph: '漢', badge: '' },
  { id: 'grammar',   label: 'Grammar',    glyph: '文', badge: '' },
  { id: 'reading',   label: 'Reading',    glyph: '読', badge: '' },
  { id: 'listening', label: 'Listening',  glyph: '聴', badge: '' },
  { id: 'phrases',   label: 'Phrases',    glyph: '慣', badge: '' },
  { id: 'cloze',     label: 'Cloze',      glyph: '穴', badge: '' },
  { id: 'conjugate', label: 'Conjugate',  glyph: '活', badge: '' },
  { id: 'mock',      label: 'Mock test',  glyph: '模', badge: 'N3' },
  { id: 'import',    label: 'Import / export', glyph: '入', badge: '' }
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "washi",
  "showFurigana": true,
  "ttsSpeed": 0.9,
  "density": "comfortable"
}/*EDITMODE-END*/;

const PALETTES = {
  washi: {
    name: 'Washi (default)',
    vars: {
      '--paper': '#ece4d3', '--paper-warm': '#e6dcc6', '--paper-light': '#f4eddd',
      '--card': '#f7f1e1', '--card-raised': '#fbf6e8',
      '--ink': '#1a1814', '--ink-2': '#36322a', '--ink-3': '#5b5448', '--ink-4': '#8a8170',
      '--line': '#cfc3a8', '--line-soft': '#ddd1b6',
      '--indigo': '#3b5573', '--persimmon': '#b3563a', '--moss': '#6c7a4a',
      '--gold': '#a8884b', '--rouge': '#8a3a3a'
    }
  },
  sumi: {
    name: 'Sumi (dark)',
    vars: {
      '--paper': '#1c1a16', '--paper-warm': '#23211c', '--paper-light': '#2a2722',
      '--card': '#26231d', '--card-raised': '#2c2922',
      '--ink': '#ece4d3', '--ink-2': '#cabd9d', '--ink-3': '#a89d80', '--ink-4': '#766e5c',
      '--line': '#3d382e', '--line-soft': '#332f27',
      '--indigo': '#7d97b6', '--persimmon': '#d77757', '--moss': '#a4b07a',
      '--gold': '#cba776', '--rouge': '#c87575'
    }
  },
  shoji: {
    name: 'Shoji (cool)',
    vars: {
      '--paper': '#e6e8e4', '--paper-warm': '#dde0db', '--paper-light': '#eef0ec',
      '--card': '#f1f3ef', '--card-raised': '#f6f8f4',
      '--ink': '#141816', '--ink-2': '#2c322e', '--ink-3': '#525853', '--ink-4': '#838985',
      '--line': '#c5cac3', '--line-soft': '#d3d7d1',
      '--indigo': '#3a567d', '--persimmon': '#a85a43', '--moss': '#5c7048',
      '--gold': '#9a8048', '--rouge': '#823c3c'
    }
  }
};

const App = () => {
  const [route, setRoute] = useS('today');
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // apply palette to :root
  useE(() => {
    const p = PALETTES[tweaks.palette] || PALETTES.washi;
    Object.entries(p.vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [tweaks.palette]);

  // density adjusts a CSS var the screens can use (we keep this lightweight)
  useE(() => {
    document.documentElement.style.setProperty('--row-pad',
      tweaks.density === 'compact' ? '10px' : '16px');
  }, [tweaks.density]);

  // Preload Japanese TTS voices (Chrome lazily loads them)
  useE(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const screens = {
    today:     <Today onJump={setRoute} />,
    cards:     <Cards />,
    kanji:     <Kanji />,
    grammar:   <Grammar />,
    reading:   <Reading />,
    listening: <Listening />,
    phrases:   <Phrases />,
    cloze:     <Cloze />,
    conjugate: <Conjugate />,
    mock:      <Mock />,
    import:    <ImportExport />
  };
  const renderItem = (n) => (
    <div key={n.id}
      className={'nav-item' + (route === n.id ? ' active' : '')}
      onClick={() => setRoute(n.id)}>
      <span className="glyph">{n.glyph}</span>
      <span>{n.label}</span>
      {n.badge && <span className="badge">{n.badge}</span>}
    </div>
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="enso" />
          <div className="brand-name">
            墨
            <span className="sub">Sumi · N3</span>
          </div>
        </div>

        <div className="nav">
          <div className="nav-section">Study</div>
          {NAV.slice(0, 4).map(renderItem)}
          <div className="nav-section">Practice</div>
          {NAV.slice(4, 9).map(renderItem)}
          <div className="nav-section">Test &amp; data</div>
          {NAV.slice(9).map(renderItem)}
        </div>

        <div className="sidebar-footer">
          <div className="streak-card">
            <div className="streak-num">23</div>
            <div className="streak-label">
              <b>day streak</b>
              連続学習日数
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 8px 0', fontSize: 11, color: 'var(--ink-4)' }}>
            <span className="mono">Goal · 30 min/day</span>
            <span className="mono">14:21</span>
          </div>
        </div>
      </aside>

      <main className="main">
        {screens[route]}
      </main>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Theme">
          <window.TweakRadio
            label="Palette"
            value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={['washi', 'sumi', 'shoji']}
          />
          <window.TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={v => setTweak('density', v)}
            options={['comfortable', 'compact']}
          />
        </window.TweakSection>
        <window.TweakSection label="Reading">
          <window.TweakToggle
            label="Furigana by default"
            value={tweaks.showFurigana}
            onChange={v => setTweak('showFurigana', v)}
          />
        </window.TweakSection>
        <window.TweakSection label="Audio">
          <window.TweakSlider
            label="TTS speed"
            value={tweaks.ttsSpeed}
            min={0.5} max={1.2} step={0.05}
            unit="×"
            onChange={v => setTweak('ttsSpeed', v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
