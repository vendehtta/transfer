// All screen components for the N3 Study app.
// Components are exported to window at the end.

const { useState, useMemo, useEffect, useRef, useCallback } = React;

/* ========== shared bits ========== */

const Ruby = ({ k, r }) => (
  <ruby>{k}<rt>{r}</rt></ruby>
);

// Render a "tokens" array (string | {k,r}) as JP text, optionally with furigana
const RenderTokens = ({ tokens, furigana }) => {
  return (
    <span className="jp" style={{ fontSize: 22, lineHeight: 2.1 }}>
      {tokens.map((t, i) => {
        if (typeof t === 'string') return <span key={i}>{t}</span>;
        if (furigana) return <Ruby key={i} k={t.k} r={t.r} />;
        return <span key={i}>{t.k}</span>;
      })}
    </span>
  );
};

// Web speech TTS — Japanese
function speakJP(text, rate = 0.95) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = rate;
    u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const jp = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja'));
    if (jp) u.voice = jp;
    window.speechSynthesis.speak(u);
  } catch (e) { /* noop */ }
}

const SpeakerIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5L6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 010 7" />
    <path d="M19 5a9 9 0 010 14" />
  </svg>
);

const PlayBtn = ({ text, label = 'play' }) => (
  <button className="btn btn-ghost" onClick={() => speakJP(text)} title="Speak (Japanese TTS)">
    <SpeakerIcon /> <span className="mono" style={{ fontSize: 10 }}>{label}</span>
  </button>
);

/* ========== TODAY (Dashboard) ========== */

const Today = ({ stats, onJump }) => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateLine = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const jpDate = today.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });

  const plan = [
    { id: 'cards',  k: '札',   label: 'Vocab review',     count: 18, time: '~9 min', target: 'cards' },
    { id: 'kanji',  k: '漢',   label: 'New kanji · 5',    count: 5,  time: '~7 min', target: 'kanji' },
    { id: 'gram',   k: '文',   label: 'Grammar drill',    count: 3,  time: '~6 min', target: 'grammar' },
    { id: 'read',   k: '読',   label: 'Reading passage',  count: 1,  time: '~5 min', target: 'reading' },
    { id: 'listen', k: '聴',   label: 'Listening lines',  count: 8,  time: '~4 min', target: 'listening' }
  ];

  // a tiny pixel-grid of last 14 days, mocked
  const heat = [3,4,2,4,4,1,0,3,4,2,4,3,5,4];

  return (
    <div data-screen-label="01 Today">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">本日</span>Today</h1>
          <div className="page-sub">{dayName} · {dateLine} · <span className="jp">{jpDate}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn"><span className="mono">JLPT N3</span></button>
          <button className="btn btn-primary" onClick={() => onJump('cards')}>Begin review →</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, marginBottom: 22 }}>
        {/* DAILY PLAN */}
        <div className="card raised" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--line-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="label">Daily plan</div>
              <div className="en-disp" style={{ fontSize: 22, marginTop: 4 }}>5 tasks · ≈31 min</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ color: 'var(--ink-4)' }}>PROGRESS</div>
              <div className="en-disp" style={{ fontSize: 22, color: 'var(--moss)' }}>2 / 5</div>
            </div>
          </div>
          <div>
            {plan.map((p, i) => (
              <div
                key={p.id}
                onClick={() => onJump(p.target)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '54px 1fr auto auto',
                  alignItems: 'center',
                  gap: 18,
                  padding: '16px 24px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
                  cursor: 'pointer',
                  transition: 'background .12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,24,20,.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: i < 2 ? 'var(--ink)' : 'var(--paper-warm)',
                  color: i < 2 ? 'var(--paper-light)' : 'var(--ink-2)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--serif-jp)', fontWeight: 600, fontSize: 22,
                  border: i < 2 ? 'none' : '1px solid var(--line)'
                }}>{p.k}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{p.label}</div>
                  <div className="mono" style={{ color: 'var(--ink-4)', marginTop: 2 }}>{p.count} items · {p.time}</div>
                </div>
                {i < 2
                  ? <span className="mono" style={{ color: 'var(--moss)' }}>● DONE</span>
                  : <span className="mono" style={{ color: 'var(--ink-4)' }}>○ TODO</span>}
                <span style={{ color: 'var(--ink-4)' }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* WORD OF THE DAY */}
        <div>
          <div className="card raised" style={{ marginBottom: 18 }}>
            <div className="label" style={{ marginBottom: 12 }}>Word of the day · 今日の言葉</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div className="jp-disp" style={{ fontSize: 54, lineHeight: 1 }}>懐かしい</div>
              <PlayBtn text="懐かしい" />
            </div>
            <div className="jp" style={{ color: 'var(--ink-4)', fontSize: 14, marginBottom: 18 }}>なつかしい</div>
            <div className="en-disp" style={{ fontSize: 18, color: 'var(--ink-2)', fontStyle: 'italic' }}>
              "Nostalgic — fondly remembered. Often said of a smell, a song, an old photo."
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
              <div className="jp" style={{ fontSize: 17 }}>この曲、懐かしいなあ。</div>
              <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', fontSize: 13, marginTop: 4 }}>"This song… brings me back."</div>
            </div>
          </div>

          {/* 14-day streak heat */}
          <div className="card">
            <div className="label" style={{ marginBottom: 12 }}>Last 14 days</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 56 }}>
              {heat.map((h, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${10 + h * 9}px`,
                  background: h === 0 ? 'var(--line-soft)' : h >= 4 ? 'var(--ink)' : 'var(--ink-3)',
                  opacity: h === 0 ? .5 : 1,
                  borderRadius: 2
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span className="mono" style={{ color: 'var(--ink-4)' }}>2 wks ago</span>
              <span className="mono" style={{ color: 'var(--ink-4)' }}>today</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS RING + STATS */}
      <div className="card raised">
        <div className="label" style={{ marginBottom: 16 }}>N3 corpus progress</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { label: 'Vocab known', cur: 412, total: 1820, color: 'var(--ink)' },
            { label: 'Kanji learned', cur: 168, total: 367, color: 'var(--indigo)' },
            { label: 'Grammar points', cur: 52, total: 124, color: 'var(--persimmon)' },
            { label: 'Mock test score', cur: 96, total: 180, color: 'var(--moss)' },
          ].map(s => (
            <div key={s.label}>
              <div className="mono" style={{ color: 'var(--ink-4)', marginBottom: 6 }}>{s.label.toUpperCase()}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span className="en-disp" style={{ fontSize: 36, lineHeight: 1, color: s.color }}>{s.cur}</span>
                <span className="mono" style={{ color: 'var(--ink-4)' }}>/ {s.total}</span>
              </div>
              <div style={{ height: 4, background: 'var(--line-soft)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${(s.cur / s.total) * 100}%`, height: '100%', background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========== CARDS (Flashcards) ========== */

const Cards = () => {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState([]); // { idx, grade }
  const deck = window.N3_VOCAB;

  const card = deck[idx];

  const next = (grade) => {
    setHistory(h => [...h, { idx, grade }]);
    setRevealed(false);
    setIdx(i => (i + 1) % deck.length);
  };

  const grades = [
    { id: 'again', label: 'Again',  jp: 'もう一度', sub: '< 1m', color: 'var(--rouge)' },
    { id: 'hard',  label: 'Hard',   jp: '難しい',   sub: '10m',  color: 'var(--persimmon)' },
    { id: 'good',  label: 'Good',   jp: 'できた',   sub: '1d',   color: 'var(--moss)' },
    { id: 'easy',  label: 'Easy',   jp: '簡単',     sub: '4d',   color: 'var(--indigo)' },
  ];

  // keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === ' ') { e.preventDefault(); setRevealed(r => !r); }
      else if (revealed) {
        if (e.key === '1') next('again');
        if (e.key === '2') next('hard');
        if (e.key === '3') next('good');
        if (e.key === '4') next('easy');
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  return (
    <div data-screen-label="02 Cards">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">札</span>Cards</h1>
          <div className="page-sub">Spaced repetition — vocab</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>{idx + 1} / {deck.length}</span>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>·</span>
          <span className="mono" style={{ color: 'var(--moss)' }}>{history.length} reviewed</span>
        </div>
      </div>

      {/* deck shadow stack */}
      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--card)',
          borderRadius: 14, border: '1px solid var(--line)',
          transform: 'translate(8px, 8px) rotate(.7deg)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--card)',
          borderRadius: 14, border: '1px solid var(--line)',
          transform: 'translate(-6px, 4px) rotate(-.9deg)', zIndex: 0
        }} />

        <div className="card raised" style={{
          position: 'relative', zIndex: 1, minHeight: 380, padding: 0,
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            padding: '14px 22px', borderBottom: '1px solid var(--line-soft)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span className="mono" style={{ color: 'var(--ink-4)' }}>{card.pos.toUpperCase()} · N3</span>
            <PlayBtn text={card.jp} label="hear" />
          </div>

          <div style={{
            flex: 1, padding: '40px 40px 30px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
          }}>
            <div className="jp-disp" style={{ fontSize: 64, lineHeight: 1.2, letterSpacing: '.04em' }}>{card.jp}</div>
            {revealed && (
              <>
                <div className="jp" style={{ fontSize: 22, color: 'var(--ink-3)', marginTop: 16 }}>{card.kana}</div>
                <div style={{ height: 1, width: 60, background: 'var(--line)', margin: '24px 0' }} />
                <div className="en-disp" style={{ fontSize: 26, color: 'var(--ink-2)' }}>{card.en}</div>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px dashed var(--line)', maxWidth: 480 }}>
                  <div className="jp" style={{ fontSize: 18, color: 'var(--ink-2)' }}>{card.ex.jp}</div>
                  <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginTop: 6, fontSize: 14 }}>"{card.ex.en}"</div>
                </div>
              </>
            )}
            {!revealed && (
              <button onClick={() => setRevealed(true)} className="btn" style={{ marginTop: 28 }}>
                Show answer · <span className="mono">SPACE</span>
              </button>
            )}
          </div>

          {revealed && (
            <div style={{ borderTop: '1px solid var(--line-soft)', padding: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {grades.map((g, i) => (
                <button key={g.id} onClick={() => next(g.id)} style={{
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  padding: '12px 8px',
                  background: 'var(--card)',
                  cursor: 'pointer',
                  transition: 'all .12s',
                  textAlign: 'center'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = g.color; e.currentTarget.style.background = 'var(--card-raised)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--card)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className="mono" style={{ color: 'var(--ink-4)' }}>{i + 1}</span>
                    <span className="mono" style={{ color: g.color }}>{g.sub}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: g.color }}>{g.label}</div>
                  <div className="jp" style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>{g.jp}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--ink-4)' }}>
        <span className="mono">SPACE</span> reveal · <span className="mono">1–4</span> grade · <span className="mono">→</span> skip
      </div>
    </div>
  );
};

/* ========== KANJI ========== */

const Kanji = () => {
  const list = window.N3_KANJI;
  const [active, setActive] = useState(0);
  const k = list[active];

  return (
    <div data-screen-label="03 Kanji">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">漢字</span>Kanji</h1>
          <div className="page-sub">N3 level · {list.length} characters</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn">By stroke ↓</button>
          <button className="btn">Filter</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28 }}>
        {/* Grid */}
        <div>
          <div className="label" style={{ marginBottom: 10 }}>Browse · {list.length}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {list.map((kk, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  aspectRatio: '1',
                  background: i === active ? 'var(--ink)' : 'var(--card)',
                  color: i === active ? 'var(--paper-light)' : 'var(--ink)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  fontFamily: 'var(--serif-jp)',
                  fontSize: 26,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all .1s',
                }}
                onMouseEnter={e => { if (i !== active) e.currentTarget.style.background = 'var(--card-raised)'; }}
                onMouseLeave={e => { if (i !== active) e.currentTarget.style.background = 'var(--card)'; }}
              >{kk.c}</button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="card raised" style={{ padding: 0 }}>
          <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, borderBottom: '1px solid var(--line-soft)' }}>
            {/* Big glyph in a tracing box */}
            <div style={{
              aspectRatio: '1',
              background: 'var(--paper-light)',
              border: '1px solid var(--line)',
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
              position: 'relative',
              backgroundImage: 'linear-gradient(var(--line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--line-soft) 1px, transparent 1px)',
              backgroundSize: '100% 50%, 50% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              <div className="jp-disp" style={{ fontSize: 160, lineHeight: 1 }}>{k.c}</div>
              <button onClick={() => speakJP(k.c)} style={{
                position: 'absolute', bottom: 10, right: 10,
                background: 'var(--card)', border: '1px solid var(--line)',
                borderRadius: 999, padding: '4px 10px', cursor: 'pointer'
              }}>
                <SpeakerIcon />
              </button>
            </div>
            <div>
              <div className="label">Meaning</div>
              <div className="en-disp" style={{ fontSize: 28, marginTop: 4 }}>{k.en}</div>
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 8, fontSize: 14 }}>
                <span className="label">On'yomi</span>
                <span className="jp" style={{ color: 'var(--indigo)' }}>{k.on}</span>
                <span className="label">Kun'yomi</span>
                <span className="jp" style={{ color: 'var(--persimmon)' }}>{k.kun}</span>
                <span className="label">Strokes</span>
                <span className="mono">{k.strokes}</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px' }}>
            <div className="label" style={{ marginBottom: 10 }}>Compound words</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {k.words.map((w, i) => (
                <div key={i} style={{
                  padding: '8px 14px',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  background: 'var(--paper-light)'
                }}>
                  <span className="jp" style={{ fontSize: 18 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '14px 28px 22px', borderTop: '1px dashed var(--line)', display: 'flex', gap: 10 }}>
            <button className="btn">Add to deck</button>
            <button className="btn">Practice writing</button>
            <button className="btn btn-ghost" onClick={() => setActive(i => (i + 1) % list.length)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== GRAMMAR ========== */

const Grammar = () => {
  const list = window.N3_GRAMMAR;
  const [open, setOpen] = useState(0);

  return (
    <div data-screen-label="04 Grammar">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">文法</span>Grammar</h1>
          <div className="page-sub">N3 patterns · {list.length} entries</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn">Drill mode</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28 }}>
        {/* List */}
        <div>
          {list.map((g, i) => (
            <button key={i} onClick={() => setOpen(i)} style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '14px 16px',
              borderRadius: 8,
              background: i === open ? 'var(--ink)' : 'transparent',
              color: i === open ? 'var(--paper-light)' : 'var(--ink-2)',
              border: '1px solid',
              borderColor: i === open ? 'var(--ink)' : 'transparent',
              marginBottom: 4,
              cursor: 'pointer'
            }}>
              <div className="jp" style={{ fontSize: 18, fontWeight: 600 }}>{g.pattern}</div>
              <div style={{ fontSize: 12, color: i === open ? 'rgba(255,255,255,.6)' : 'var(--ink-4)', marginTop: 2 }}>{g.meaning}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="card raised">
          {(() => {
            const g = list[open];
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <div>
                    <div className="label">Pattern</div>
                    <div className="jp-disp" style={{ fontSize: 44, lineHeight: 1.1, marginTop: 6 }}>{g.pattern}</div>
                    <div className="en-disp" style={{ fontSize: 20, color: 'var(--ink-3)', fontStyle: 'italic', marginTop: 8 }}>
                      "{g.meaning}"
                    </div>
                  </div>
                  <span className="mono" style={{ color: 'var(--ink-4)', padding: '4px 8px', border: '1px solid var(--line)', borderRadius: 4 }}>
                    {open + 1} / {list.length}
                  </span>
                </div>

                <div style={{ paddingTop: 18, borderTop: '1px solid var(--line-soft)' }}>
                  <div className="label" style={{ marginBottom: 8 }}>How to use</div>
                  <div style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 18 }}>{g.explanation}</div>

                  <div className="label" style={{ marginBottom: 8 }}>Forms</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
                    {g.forms.map((f, i) => (
                      <div key={i} className="jp" style={{
                        padding: '6px 12px',
                        background: 'var(--paper-light)',
                        border: '1px solid var(--line)',
                        borderRadius: 4,
                        fontSize: 14
                      }}>{f}</div>
                    ))}
                  </div>

                  <div className="label" style={{ marginBottom: 10 }}>Examples</div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {g.examples.map((ex, i) => (
                      <div key={i} style={{
                        padding: '14px 16px',
                        background: 'var(--paper-light)',
                        borderLeft: '2px solid var(--ink-3)',
                        borderRadius: '0 6px 6px 0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div className="jp" style={{ fontSize: 19 }}>{ex.jp}</div>
                          <button onClick={() => speakJP(ex.jp)} className="btn btn-ghost" style={{ padding: 6 }}>
                            <SpeakerIcon />
                          </button>
                        </div>
                        <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginTop: 6, fontSize: 14 }}>"{ex.en}"</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

/* ========== READING ========== */

const Reading = () => {
  const list = window.N3_READING;
  const [idx, setIdx] = useState(0);
  const [furi, setFuri] = useState(true);
  const [showTr, setShowTr] = useState(false);
  const r = list[idx];

  return (
    <div data-screen-label="05 Reading">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">読解</span>Reading</h1>
          <div className="page-sub">Short passages with furigana support</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => setFuri(f => !f)}>
            <span className="mono">フリガナ</span> {furi ? 'on' : 'off'}
          </button>
          <button className="btn" onClick={() => speakJP(r.tokens.map(t => typeof t === 'string' ? t : t.k).join(''))}>
            <SpeakerIcon /> Read aloud
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 12 }}>Passages</div>
          {list.map((p, i) => (
            <button key={i} onClick={() => { setIdx(i); setShowTr(false); }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '12px 14px',
              border: '1px solid var(--line)',
              borderRadius: 8,
              marginBottom: 8,
              background: i === idx ? 'var(--ink)' : 'var(--card)',
              color: i === idx ? 'var(--paper-light)' : 'var(--ink)',
              cursor: 'pointer'
            }}>
              <div className="jp" style={{ fontWeight: 600 }}>{p.title}</div>
              <div className="mono" style={{ fontSize: 10, opacity: .65, marginTop: 4 }}>{p.level}</div>
            </button>
          ))}
        </div>

        <div className="card raised" style={{ padding: '40px 48px' }}>
          <div className="label" style={{ marginBottom: 8 }}>{r.level}</div>
          <h2 className="jp-disp" style={{ fontSize: 32, margin: '0 0 6px' }}>{r.title}</h2>
          <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginBottom: 30 }}>"{r.en_title}"</div>

          <RenderTokens tokens={r.tokens} furigana={furi} />

          <div style={{ marginTop: 36, paddingTop: 22, borderTop: '1px dashed var(--line)' }}>
            {!showTr ? (
              <button className="btn" onClick={() => setShowTr(true)}>Show English translation</button>
            ) : (
              <>
                <div className="label" style={{ marginBottom: 8 }}>Translation</div>
                <div className="en-disp" style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--ink-2)', lineHeight: 1.7 }}>
                  {r.translation}
                </div>
                <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => setShowTr(false)}>Hide</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========== LISTENING ========== */

const Listening = () => {
  const list = window.N3_LISTENING;
  const [rate, setRate] = useState(0.9);
  const [reveal, setReveal] = useState({}); // idx → bool

  return (
    <div data-screen-label="06 Listening">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">聴解</span>Listening</h1>
          <div className="page-sub">Tap to hear · transcripts hidden until you decide</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>SPEED</span>
          {[0.7, 0.9, 1.0].map(r => (
            <button key={r} onClick={() => setRate(r)} className="btn" style={{
              background: rate === r ? 'var(--ink)' : 'var(--card)',
              color: rate === r ? 'var(--paper-light)' : 'var(--ink-2)',
              borderColor: rate === r ? 'var(--ink)' : 'var(--line)'
            }}>{r}×</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {list.map((l, i) => (
          <div key={i} className="card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <button
                onClick={() => speakJP(l.jp, rate)}
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--ink)', color: 'var(--paper-light)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                  border: 'none', cursor: 'pointer',
                  transition: 'transform .12s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="mono" style={{ color: 'var(--ink-4)', marginBottom: 4 }}>LINE {String(i + 1).padStart(2, '0')}</div>
                    {reveal[i] ? (
                      <>
                        <div className="jp" style={{ fontSize: 19, marginBottom: 4 }}>{l.jp}</div>
                        <div className="jp" style={{ color: 'var(--ink-4)', fontSize: 13 }}>{l.kana}</div>
                        <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>"{l.en}"</div>
                      </>
                    ) : (
                      <div style={{ color: 'var(--ink-4)', fontStyle: 'italic', fontSize: 14 }}>Transcript hidden — listen first</div>
                    )}
                  </div>
                  <button className="btn btn-ghost" onClick={() => setReveal(r => ({ ...r, [i]: !r[i] }))}>
                    {reveal[i] ? 'Hide' : 'Reveal'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== PHRASES ========== */

const Phrases = () => {
  const list = window.N3_PHRASES;
  return (
    <div data-screen-label="07 Phrases">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">慣用</span>Native phrases</h1>
          <div className="page-sub">Everyday expressions with cultural nuance</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {list.map((p, i) => (
          <div key={i} className="card raised" style={{ display: 'flex', flexDirection: 'column', padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div className="jp-disp" style={{ fontSize: 30, lineHeight: 1.2 }}>{p.jp}</div>
                <div className="jp" style={{ color: 'var(--ink-4)', fontSize: 13, marginTop: 4 }}>{p.kana}</div>
              </div>
              <PlayBtn text={p.jp} />
            </div>
            <div className="en-disp" style={{ fontSize: 17, color: 'var(--ink-2)', fontStyle: 'italic', marginTop: 14, marginBottom: 12 }}>
              {p.en}
            </div>
            <div style={{
              marginTop: 'auto', paddingTop: 12, borderTop: '1px dashed var(--line)',
              fontSize: 12.5, color: 'var(--ink-3)'
            }}>
              <span className="mono" style={{ color: 'var(--gold)', marginRight: 6 }}>NUANCE</span>
              {p.nuance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Export ========== */
Object.assign(window, { Today, Cards, Kanji, Grammar, Reading, Listening, Phrases, speakJP });
