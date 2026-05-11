/* ============================================================
   Personal layer — onboarding, real stats, dynamic Today.
   Everything starts at zero. Nothing is faked.
   ============================================================ */
(() => {
  const { useState, useEffect } = React;

  /* ---------- Stats store ---------- */
  const KEY = 'sumi.n3.personal.v1';
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const defaults = () => ({
    name: '', started: null, target: '',
    lastStudy: null, streak: 0,
    days: {},             // 'yyyy-mm-dd' -> activity units (any > 0 keeps streak)
    daily: {},            // 'yyyy-mm-dd' -> { cards, kanji, grammar, reading, listening }
    seenKanji: [], seenGrammar: [], mockScore: null,
  });
  const load = () => {
    try { return { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return defaults(); }
  };
  const subs = new Set();
  const emit = () => subs.forEach(fn => { try { fn(); } catch {} });
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} emit(); };

  const computeStreak = (s) => {
    let n = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().slice(0, 10);
      if (s.days[k]) { n++; d.setDate(d.getDate() - 1); } else break;
    }
    return n;
  };

  const Stats = {
    get: load,
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    touch(kind, n = 1) {
      const s = load();
      const k = todayStr();
      if (n > 0) s.days[k] = (s.days[k] || 0) + n;
      if (kind) {
        s.daily[k] = s.daily[k] || {};
        s.daily[k][kind] = true;
      }
      s.lastStudy = k;
      s.streak = computeStreak(s);
      save(s);
    },
    setName(name, target) {
      const s = load();
      if (!s.started) s.started = Date.now();
      s.name = name;
      if (target) s.target = target;
      save(s);
    },
    reset() {
      try {
        localStorage.removeItem(KEY);
        localStorage.removeItem('sumi.n3.srs.v1');
        localStorage.removeItem('sumi.n3.userdeck.v1');
      } catch {}
      emit();
    },
    heat14() {
      const s = load();
      const out = [];
      const d = new Date(); d.setDate(d.getDate() - 13);
      for (let i = 0; i < 14; i++) {
        out.push(s.days[d.toISOString().slice(0, 10)] || 0);
        d.setDate(d.getDate() + 1);
      }
      return out;
    },
    dayN() {
      const s = load();
      if (!s.started) return 0;
      return Math.floor((Date.now() - s.started) / 86400000) + 1;
    },
  };
  window.SumiStats = Stats;

  /* ---------- Onboarding modal ---------- */
  const Onboarding = () => {
    const [s, setS] = useState(Stats.get());
    useEffect(() => Stats.subscribe(() => setS(Stats.get())), []);
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    if (s.name) return null;
    const submit = (e) => {
      if (e) e.preventDefault();
      const n = name.trim() || '友';
      Stats.setName(n, target);
    };
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(20,18,15,.62)', backdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 28,
      }}>
        <form onSubmit={submit} className="card raised" style={{ maxWidth: 560, width: '100%', padding: 44 }}>
          <div className="jp-disp" style={{ fontSize: 56, lineHeight: 1, marginBottom: 6 }}>初めまして</div>
          <div className="label" style={{ marginBottom: 22 }}>Hajimemashite — nice to meet you.</div>
          <p className="en-disp" style={{ fontSize: 17, color: 'var(--ink-2)', marginBottom: 28, lineHeight: 1.55 }}>
            This is your study journal. It starts blank — no streak, no progress, no fake numbers.
            Your data fills in only as you actually study.
          </p>
          <div style={{ marginBottom: 18 }}>
            <div className="mono" style={{ color: 'var(--ink-4)', marginBottom: 6 }}>WHAT SHOULD WE CALL YOU?</div>
            <input
              autoFocus value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', background: 'var(--paper-light)', fontFamily: 'inherit', fontSize: 17, borderRadius: 4, color: 'var(--ink)' }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <div className="mono" style={{ color: 'var(--ink-4)', marginBottom: 6 }}>JLPT N3 TARGET DATE · OPTIONAL</div>
            <input
              type="date" value={target} onChange={e => setTarget(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line)', background: 'var(--paper-light)', fontFamily: 'inherit', fontSize: 16, borderRadius: 4, color: 'var(--ink)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            一日目 · Begin day one →
          </button>
          <div className="mono" style={{ marginTop: 16, color: 'var(--ink-4)', textAlign: 'center' }}>
            千里の道も一歩から · a journey of 1000 ri begins with one step
          </div>
        </form>
      </div>
    );
  };
  window.Onboarding = Onboarding;

  /* ---------- Mount onboarding into its own root ---------- */
  const mountOnboarding = () => {
    if (document.getElementById('sumi-onboarding-root')) return;
    if (!document.body) { setTimeout(mountOnboarding, 50); return; }
    const div = document.createElement('div');
    div.id = 'sumi-onboarding-root';
    document.body.appendChild(div);
    ReactDOM.createRoot(div).render(<Onboarding />);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountOnboarding);
  } else { mountOnboarding(); }

  /* ---------- Dynamic streak + reset link in sidebar ---------- */
  const syncStreak = () => {
    const s = load();
    document.querySelectorAll('.streak-num').forEach(el => {
      const v = String(s.streak);
      if (el.textContent !== v) el.textContent = v;
    });
  };
  const mountResetLink = () => {
    if (document.getElementById('sumi-reset-link')) return;
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return;
    const wrap = document.createElement('div');
    wrap.id = 'sumi-reset-link';
    wrap.style.cssText =
      'margin-top:14px;text-align:center;font-family:"JetBrains Mono",ui-monospace,monospace;' +
      'font-size:10px;letter-spacing:.08em;color:var(--ink-4);cursor:pointer;text-transform:uppercase;' +
      'padding:6px;border-top:1px dashed var(--line-soft);';
    wrap.textContent = '↻  start over';
    wrap.onmouseenter = () => { wrap.style.color = 'var(--rouge, var(--persimmon))'; };
    wrap.onmouseleave = () => { wrap.style.color = 'var(--ink-4)'; };
    wrap.onclick = () => {
      if (confirm('Reset everything — name, streak, SRS, imported deck, daily progress? This cannot be undone.')) {
        Stats.reset();
        location.reload();
      }
    };
    footer.appendChild(wrap);
  };
  setInterval(() => { syncStreak(); mountResetLink(); }, 600);
  Stats.subscribe(syncStreak);

  /* ---------- Auto-track Cards via SRS writes ---------- */
  const origSet = localStorage.setItem.bind(localStorage);
  let lastTotalReps = null;
  localStorage.setItem = function (k, v) {
    origSet(k, v);
    if (k === 'sumi.n3.srs.v1') {
      try {
        const cur = JSON.parse(v);
        const totalReps = Object.values(cur).reduce((a, c) => a + (c.reps || 0) + (c.lapses || 0), 0);
        if (lastTotalReps !== null && totalReps > lastTotalReps) {
          Stats.touch('cards', totalReps - lastTotalReps);
        }
        lastTotalReps = totalReps;
      } catch {}
    }
  };
  // prime
  try {
    const cur = JSON.parse(localStorage.getItem('sumi.n3.srs.v1') || '{}');
    lastTotalReps = Object.values(cur).reduce((a, c) => a + (c.reps || 0) + (c.lapses || 0), 0);
  } catch {}

  /* ---------- Dynamic Today ---------- */
  const Today = ({ onJump }) => {
    const [s, setS] = useState(Stats.get());
    useEffect(() => Stats.subscribe(() => setS(Stats.get())), []);

    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateLine = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const jpDate = today.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });

    const done = s.daily[todayStr()] || {};
    const plan = [
      { id: 'cards',     k: '札', label: 'Vocab review',    target: 'cards',     time: '~9 min' },
      { id: 'kanji',     k: '漢', label: 'New kanji',       target: 'kanji',     time: '~7 min' },
      { id: 'grammar',   k: '文', label: 'Grammar drill',   target: 'grammar',   time: '~6 min' },
      { id: 'reading',   k: '読', label: 'Reading passage', target: 'reading',   time: '~5 min' },
      { id: 'listening', k: '聴', label: 'Listening lines', target: 'listening', time: '~4 min' },
    ];
    const doneCount = plan.filter(p => done[p.id]).length;

    const handleTile = (p) => {
      Stats.touch(p.id, 1);
      onJump(p.target);
    };
    const toggleTile = (e, p) => {
      e.stopPropagation();
      const cur = Stats.get();
      const dk = todayStr();
      cur.daily[dk] = cur.daily[dk] || {};
      const was = !!cur.daily[dk][p.id];
      cur.daily[dk][p.id] = !was;
      cur.days[dk] = Math.max(0, (cur.days[dk] || 0) + (was ? -1 : 1));
      cur.streak = computeStreak(cur);
      save(cur);
    };

    const heat = Stats.heat14();
    const dayN = Stats.dayN();

    // word of day, deterministic
    const wod = (() => {
      const pool = window.N3_VOCAB || [];
      if (!pool.length) return null;
      const seed = today.getFullYear() * 1000 + today.getMonth() * 32 + today.getDate();
      return pool[seed % pool.length];
    })();

    // real corpus progress
    const srs = (() => {
      try { return JSON.parse(localStorage.getItem('sumi.n3.srs.v1') || '{}'); }
      catch { return {}; }
    })();
    const vocabKnown = Object.values(srs).filter(c => (c.reps || 0) >= 2).length;
    const vocabSeen  = Object.keys(srs).length;
    const vocabTotal = (window.N3_VOCAB || []).length || 0;
    const kanjiTotal = (window.N3_KANJI || []).length || 0;
    const grammarTotal = (window.N3_GRAMMAR || []).length || 0;
    const corpus = [
      { label: 'Vocab known',     cur: vocabKnown,                 total: vocabTotal,   color: 'var(--ink)',       sub: `${vocabSeen} seen` },
      { label: 'Kanji learned',   cur: (s.seenKanji || []).length,   total: kanjiTotal,   color: 'var(--indigo)' },
      { label: 'Grammar points',  cur: (s.seenGrammar || []).length, total: grammarTotal, color: 'var(--persimmon)' },
      { label: 'Mock test score', cur: s.mockScore || 0,             total: 180,          color: 'var(--moss)' },
    ];

    const greet = (() => {
      const hour = today.getHours();
      const g = hour < 5 ? 'こんばんは' : hour < 11 ? 'おはよう' : hour < 18 ? 'こんにちは' : 'こんばんは';
      return `${g}, ${s.name || '友'}`;
    })();

    const daysToTarget = s.target
      ? Math.max(0, Math.ceil((new Date(s.target).getTime() - Date.now()) / 86400000))
      : null;

    return (
      <div data-screen-label="01 Today">
        <div className="page-head">
          <div>
            <h1 className="page-title"><span className="kanji">本日</span>Today</h1>
            <div className="page-sub">
              <span className="jp">{greet}</span> · {dayN > 0 ? `Day ${dayN}` : 'Day 1'} · {dayName}, {dateLine}
            </div>
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
                <div className="en-disp" style={{ fontSize: 22, color: doneCount === 5 ? 'var(--moss)' : 'var(--ink-2)' }}>{doneCount} / 5</div>
              </div>
            </div>
            <div>
              {plan.map((p, i) => {
                const isDone = !!done[p.id];
                return (
                  <div
                    key={p.id}
                    onClick={() => handleTile(p)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '54px 1fr auto auto',
                      alignItems: 'center', gap: 18, padding: '16px 24px',
                      borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)',
                      cursor: 'pointer', transition: 'background .12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,24,20,.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: isDone ? 'var(--ink)' : 'var(--paper-warm)',
                      color: isDone ? 'var(--paper-light)' : 'var(--ink-2)',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--serif-jp)', fontWeight: 600, fontSize: 22,
                      border: isDone ? 'none' : '1px solid var(--line)',
                      transition: 'all .2s'
                    }}>{p.k}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{p.label}</div>
                      <div className="mono" style={{ color: 'var(--ink-4)', marginTop: 2 }}>
                        {isDone ? 'completed today · tap → revisit' : `not yet · ${p.time}`}
                      </div>
                    </div>
                    <span
                      className="mono"
                      onClick={e => toggleTile(e, p)}
                      title="tap to toggle"
                      style={{ color: isDone ? 'var(--moss)' : 'var(--ink-4)', padding: '4px 6px', borderRadius: 4 }}
                    >
                      {isDone ? '● DONE' : '○ TODO'}
                    </span>
                    <span style={{ color: 'var(--ink-4)' }}>→</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WORD OF DAY + HEAT */}
          <div>
            <div className="card raised" style={{ marginBottom: 18 }}>
              <div className="label" style={{ marginBottom: 12 }}>Word of the day · 今日の言葉</div>
              {wod ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 12 }}>
                    <div className="jp-disp" style={{ fontSize: 46, lineHeight: 1.1 }}>{wod.word}</div>
                    {window.PlayBtn && <window.PlayBtn text={wod.word} />}
                  </div>
                  <div className="jp" style={{ color: 'var(--ink-4)', fontSize: 14, marginBottom: 14 }}>{wod.reading}</div>
                  <div className="en-disp" style={{ fontSize: 17, color: 'var(--ink-2)', fontStyle: 'italic' }}>"{wod.meaning}"</div>
                  {wod.example && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--line)' }}>
                      <div className="jp" style={{ fontSize: 16 }}>{wod.example}</div>
                      {wod.exampleEn && (
                        <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', fontSize: 13, marginTop: 4 }}>
                          "{wod.exampleEn}"
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="en-disp" style={{ color: 'var(--ink-4)' }}>Vocab pool empty.</div>
              )}
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div className="label">Last 14 days</div>
                <div className="mono" style={{ color: s.streak > 0 ? 'var(--ink-2)' : 'var(--ink-4)' }}>
                  STREAK · {s.streak}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 56 }}>
                {heat.map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${10 + Math.min(h, 12) * 4}px`,
                    background: h === 0 ? 'var(--line-soft)' : h >= 8 ? 'var(--ink)' : 'var(--ink-3)',
                    opacity: h === 0 ? .5 : 1,
                    borderRadius: 2
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span className="mono" style={{ color: 'var(--ink-4)' }}>2 wks ago</span>
                <span className="mono" style={{ color: 'var(--ink-4)' }}>today</span>
              </div>
              {s.streak === 0 && (
                <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
                  Your streak begins the first time you study today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CORPUS PROGRESS */}
        <div className="card raised">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div className="label">N3 corpus progress</div>
            {daysToTarget !== null && (
              <div className="mono" style={{ color: 'var(--ink-4)' }}>
                TARGET · {new Date(s.target).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {daysToTarget} days
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {corpus.map(st => (
              <div key={st.label}>
                <div className="mono" style={{ color: 'var(--ink-4)', marginBottom: 6 }}>{st.label.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span className="en-disp" style={{ fontSize: 36, lineHeight: 1, color: st.color }}>{st.cur}</span>
                  <span className="mono" style={{ color: 'var(--ink-4)' }}>/ {st.total}</span>
                </div>
                <div style={{ height: 4, background: 'var(--line-soft)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    width: `${st.total ? Math.min(100, (st.cur / st.total) * 100) : 0}%`,
                    height: '100%', background: st.color, transition: 'width .5s'
                  }} />
                </div>
                {st.sub && <div className="mono" style={{ color: 'var(--ink-4)', marginTop: 6 }}>{st.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  window.Today = Today;
})();
