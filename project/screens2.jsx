// Expansion screens: replaces Cards (real SRS), Listening (dialogues),
// adds Cloze, Conjugate, Mock test, Import / Export.

const { useState: uS2, useEffect: uE2, useMemo: uM2, useRef: uR2 } = React;

// merge expansion data into main pools
window.N3_VOCAB   = (window.N3_VOCAB   || []).concat(window.N3_VOCAB_EXTRA   || []);
window.N3_KANJI   = (window.N3_KANJI   || []).concat(window.N3_KANJI_EXTRA   || []);
window.N3_PHRASES = (window.N3_PHRASES || []).concat(window.N3_PHRASES_EXTRA || []);

/* ───────────────────── SRS ENGINE ───────────────────── */
// Lightweight Anki-style SM-2 lite. Persists per-card state to localStorage.
// Each state: { ef, ivl (days), reps, due (timestamp ms), lapses }
const SRS_KEY = 'sumi.n3.srs.v1';

const SRS = {
  load() {
    try { return JSON.parse(localStorage.getItem(SRS_KEY) || '{}'); }
    catch { return {}; }
  },
  save(state) {
    try { localStorage.setItem(SRS_KEY, JSON.stringify(state)); } catch {}
  },
  // grade ∈ 'again'|'hard'|'good'|'easy'
  apply(card, grade, now = Date.now()) {
    const next = { ef: 2.5, ivl: 0, reps: 0, due: now, lapses: 0, ...card };
    const MIN_EF = 1.3;
    if (grade === 'again') {
      next.reps = 0;
      next.lapses += 1;
      next.ef = Math.max(MIN_EF, next.ef - 0.2);
      next.ivl = 0;
      next.due = now + 60 * 1000; // 1 min
    } else {
      next.reps += 1;
      if (grade === 'hard') next.ef = Math.max(MIN_EF, next.ef - 0.15);
      if (grade === 'good') next.ef = next.ef;
      if (grade === 'easy') next.ef = next.ef + 0.15;
      if (next.reps === 1) next.ivl = grade === 'easy' ? 4 : 1;
      else if (next.reps === 2) next.ivl = grade === 'easy' ? 7 : 3;
      else next.ivl = Math.round(next.ivl * next.ef * (grade === 'hard' ? 0.8 : grade === 'easy' ? 1.3 : 1));
      next.due = now + next.ivl * 86400000;
    }
    return next;
  }
};

/* ───────────────────── CARDS (with real SRS) ───────────────────── */

const Cards2 = () => {
  const deck = window.N3_VOCAB;
  const [state, setState] = uS2(() => SRS.load());
  const [tick, setTick] = uS2(0);              // re-render trigger
  const [revealed, setRevealed] = uS2(false);
  const [reviewedCount, setReviewedCount] = uS2(0);

  // build a sorted queue: due first (by due asc), then never-seen
  const queue = uM2(() => {
    const now = Date.now();
    const seenIds = Object.keys(state);
    const due = deck
      .map((c, i) => ({ i, c, s: state[c.jp] }))
      .filter(x => x.s && x.s.due <= now)
      .sort((a, b) => a.s.due - b.s.due);
    const newCards = deck
      .map((c, i) => ({ i, c, s: null }))
      .filter(x => !state[x.c.jp]);
    return [...due, ...newCards];
  }, [deck, state, tick]);

  const current = queue[0];

  const grade = (g) => {
    if (!current) return;
    const next = SRS.apply(state[current.c.jp] || {}, g);
    const newState = { ...state, [current.c.jp]: next };
    setState(newState);
    SRS.save(newState);
    setReviewedCount(c => c + 1);
    setRevealed(false);
    setTick(t => t + 1);
  };

  uE2(() => {
    const h = (e) => {
      if (e.key === ' ') { e.preventDefault(); setRevealed(r => !r); }
      else if (revealed) {
        if (e.key === '1') grade('again');
        if (e.key === '2') grade('hard');
        if (e.key === '3') grade('good');
        if (e.key === '4') grade('easy');
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const dueCount = uM2(() => {
    const now = Date.now();
    return deck.filter(c => state[c.jp] && state[c.jp].due <= now).length;
  }, [state, tick, deck]);
  const newCount = deck.length - Object.keys(state).length;

  const grades = [
    { id: 'again', label: 'Again', jp: 'もう一度', color: 'var(--rouge)' },
    { id: 'hard',  label: 'Hard',  jp: '難しい',   color: 'var(--persimmon)' },
    { id: 'good',  label: 'Good',  jp: 'できた',   color: 'var(--moss)' },
    { id: 'easy',  label: 'Easy',  jp: '簡単',     color: 'var(--indigo)' },
  ];

  // preview interval per grade for the active card
  const previewIvl = (g) => {
    if (!current) return '';
    const next = SRS.apply(state[current.c.jp] || {}, g);
    if (next.ivl === 0) return '<1m';
    if (next.ivl === 1) return '1d';
    return next.ivl + 'd';
  };

  if (!current) {
    return (
      <div data-screen-label="02 Cards">
        <div className="page-head">
          <div>
            <h1 className="page-title"><span className="kanji">札</span>Cards</h1>
            <div className="page-sub">Spaced repetition — vocab</div>
          </div>
        </div>
        <div className="card raised" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div className="jp-disp" style={{ fontSize: 64 }}>完了</div>
          <div className="en-disp" style={{ fontSize: 22, color: 'var(--ink-3)', fontStyle: 'italic', marginTop: 12 }}>
            All caught up — come back later for the next review.
          </div>
          <div className="mono" style={{ color: 'var(--ink-4)', marginTop: 18 }}>{reviewedCount} reviewed this session</div>
        </div>
      </div>
    );
  }

  const card = current.c;
  const st   = state[card.jp];

  return (
    <div data-screen-label="02 Cards">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">札</span>Cards</h1>
          <div className="page-sub">Spaced repetition · {deck.length} in deck</div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="mono" style={{ color: 'var(--persimmon)' }}>{dueCount} due</span>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>·</span>
          <span className="mono" style={{ color: 'var(--indigo)' }}>{newCount} new</span>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>·</span>
          <span className="mono" style={{ color: 'var(--moss)' }}>{reviewedCount} done</span>
        </div>
      </div>

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

        <div className="card raised" style={{ position: 'relative', zIndex: 1, minHeight: 380, padding: 0 }}>
          <div style={{
            padding: '14px 22px', borderBottom: '1px solid var(--line-soft)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span className="mono" style={{ color: 'var(--ink-4)' }}>
              {card.pos.toUpperCase()} · N3 · {st ? `seen ${st.reps}× · ef ${st.ef.toFixed(2)}` : 'NEW'}
            </span>
            <button className="btn btn-ghost" onClick={() => window.speakJP(card.jp)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 010 7"/></svg> hear
            </button>
          </div>

          <div style={{ padding: '40px 40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div className="jp-disp" style={{ fontSize: 64, lineHeight: 1.2 }}>{card.jp}</div>
            {revealed ? (
              <>
                <div className="jp" style={{ fontSize: 22, color: 'var(--ink-3)', marginTop: 16 }}>{card.kana}</div>
                <div style={{ height: 1, width: 60, background: 'var(--line)', margin: '24px 0' }} />
                <div className="en-disp" style={{ fontSize: 26 }}>{card.en}</div>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px dashed var(--line)', maxWidth: 480 }}>
                  <div className="jp" style={{ fontSize: 18 }}>{card.ex.jp}</div>
                  <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginTop: 6, fontSize: 14 }}>"{card.ex.en}"</div>
                </div>
              </>
            ) : (
              <button onClick={() => setRevealed(true)} className="btn" style={{ marginTop: 28 }}>
                Show answer · <span className="mono">SPACE</span>
              </button>
            )}
          </div>

          {revealed && (
            <div style={{ borderTop: '1px solid var(--line-soft)', padding: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {grades.map((g, i) => (
                <button key={g.id} onClick={() => grade(g.id)} style={{
                  border: '1px solid var(--line)', borderRadius: 8, padding: '12px 8px',
                  background: 'var(--card)', cursor: 'pointer', textAlign: 'center'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = g.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className="mono" style={{ color: 'var(--ink-4)' }}>{i + 1}</span>
                    <span className="mono" style={{ color: g.color }}>{previewIvl(g.id)}</span>
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
        <span className="mono">SPACE</span> reveal · <span className="mono">1–4</span> grade · progress saved locally
      </div>
    </div>
  );
};

/* ───────────────────── LISTENING (single lines + dialogues) ───────────────────── */

const Listening2 = () => {
  const lines = window.N3_LISTENING;
  const dialogues = window.N3_DIALOGUES;
  const [mode, setMode] = uS2('dialogue');  // 'dialogue' | 'lines'
  const [rate, setRate] = uS2(0.9);
  const [revealAll, setRevealAll] = uS2({}); // {key: bool}
  const [diaIdx, setDiaIdx] = uS2(0);
  const [playingTurn, setPlayingTurn] = uS2(-1);
  const playRunRef = uR2(0);

  const dia = dialogues[diaIdx];

  const playDialogue = async () => {
    const runId = ++playRunRef.current;
    for (let i = 0; i < dia.turns.length; i++) {
      if (runId !== playRunRef.current) return;
      setPlayingTurn(i);
      window.speakJP(dia.turns[i].jp, rate);
      // wait until speech ends, then small pause
      await new Promise(res => {
        const check = () => {
          if (runId !== playRunRef.current) return res();
          if (!window.speechSynthesis.speaking) return setTimeout(res, 380);
          setTimeout(check, 120);
        };
        setTimeout(check, 300);
      });
    }
    setPlayingTurn(-1);
  };
  const stopDialogue = () => { playRunRef.current++; window.speechSynthesis.cancel(); setPlayingTurn(-1); };

  return (
    <div data-screen-label="06 Listening">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">聴解</span>Listening</h1>
          <div className="page-sub">Dialogues and single lines</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 999, padding: 3 }}>
            {['dialogue', 'lines'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: mode === m ? 'var(--ink)' : 'transparent',
                color: mode === m ? 'var(--paper-light)' : 'var(--ink-3)',
                fontSize: 12, fontWeight: 500
              }}>{m === 'dialogue' ? 'Dialogues' : 'Single lines'}</button>
            ))}
          </div>
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

      {mode === 'dialogue' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28 }}>
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Scenarios</div>
            {dialogues.map((d, i) => (
              <button key={i} onClick={() => { stopDialogue(); setDiaIdx(i); }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 14px', border: '1px solid var(--line)',
                borderRadius: 8, marginBottom: 8,
                background: i === diaIdx ? 'var(--ink)' : 'var(--card)',
                color: i === diaIdx ? 'var(--paper-light)' : 'var(--ink)',
                cursor: 'pointer'
              }}>
                <div className="jp" style={{ fontWeight: 600 }}>{d.title}</div>
                <div className="en-disp" style={{ fontSize: 12, fontStyle: 'italic', opacity: .65, marginTop: 4 }}>"{d.en_title}"</div>
              </button>
            ))}
          </div>

          <div className="card raised" style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
              <div>
                <div className="label">Dialogue</div>
                <h2 className="jp-disp" style={{ fontSize: 28, margin: '4px 0 0' }}>{dia.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setRevealAll(r => ({ ...r, [diaIdx]: !r[diaIdx] }))}>
                  {revealAll[diaIdx] ? 'Hide transcript' : 'Reveal transcript'}
                </button>
                {playingTurn === -1
                  ? <button className="btn btn-primary" onClick={playDialogue}>▶ Play full</button>
                  : <button className="btn" onClick={stopDialogue}>■ Stop</button>}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              {dia.turns.map((t, i) => {
                const isA = t.s === 'A';
                const playing = playingTurn === i;
                return (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr auto',
                    gap: 14,
                    alignItems: 'flex-start',
                    padding: '14px 16px',
                    background: playing ? 'var(--paper-light)' : 'transparent',
                    borderLeft: '3px solid',
                    borderLeftColor: playing ? (isA ? 'var(--indigo)' : 'var(--persimmon)') : 'transparent',
                    borderRadius: '0 8px 8px 0',
                    transition: 'all .15s'
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isA ? 'var(--indigo)' : 'var(--persimmon)',
                      color: 'var(--paper-light)',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600
                    }}>{t.s}</div>
                    <div>
                      <div className="jp" style={{ fontSize: 18, lineHeight: 1.5 }}>{t.jp}</div>
                      {revealAll[diaIdx] && (
                        <div className="en-disp" style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink-4)', marginTop: 6 }}>"{t.en}"</div>
                      )}
                    </div>
                    <button className="btn btn-ghost" onClick={() => window.speakJP(t.jp, rate)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {lines.map((l, i) => (
            <div key={i} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
                <button onClick={() => window.speakJP(l.jp, rate)} style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--ink)', color: 'var(--paper-light)',
                  display: 'grid', placeItems: 'center', flexShrink: 0, border: 'none', cursor: 'pointer'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div className="mono" style={{ color: 'var(--ink-4)', marginBottom: 4 }}>LINE {String(i + 1).padStart(2, '0')}</div>
                      {revealAll['L' + i] ? (
                        <>
                          <div className="jp" style={{ fontSize: 19 }}>{l.jp}</div>
                          <div className="jp" style={{ color: 'var(--ink-4)', fontSize: 13 }}>{l.kana}</div>
                          <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-3)', marginTop: 6, fontSize: 14 }}>"{l.en}"</div>
                        </>
                      ) : (
                        <div style={{ color: 'var(--ink-4)', fontStyle: 'italic', fontSize: 14 }}>Transcript hidden — listen first</div>
                      )}
                    </div>
                    <button className="btn btn-ghost" onClick={() => setRevealAll(r => ({ ...r, ['L' + i]: !r['L' + i] }))}>
                      {revealAll['L' + i] ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ───────────────────── CLOZE ───────────────────── */

const Cloze = () => {
  const items = window.N3_CLOZE;
  const [idx, setIdx] = uS2(0);
  const [picked, setPicked] = uS2(null);
  const [stats, setStats] = uS2({ right: 0, wrong: 0 });
  const item = items[idx];

  const pick = (c) => {
    if (picked !== null) return;
    setPicked(c);
    setStats(s => c === item.answer ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 });
  };
  const next = () => { setPicked(null); setIdx(i => (i + 1) % items.length); };

  return (
    <div data-screen-label="08 Cloze">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">穴埋め</span>Cloze</h1>
          <div className="page-sub">Sentence mining — fill the gap</div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span className="mono" style={{ color: 'var(--moss)' }}>● {stats.right} right</span>
          <span className="mono" style={{ color: 'var(--rouge)' }}>● {stats.wrong} wrong</span>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>{idx + 1}/{items.length}</span>
        </div>
      </div>

      <div className="card raised" style={{ maxWidth: 820, margin: '0 auto', padding: '48px 56px' }}>
        <div className="label" style={{ marginBottom: 8 }}>Complete the sentence</div>
        <div className="jp" style={{ fontSize: 28, lineHeight: 1.8 }}>
          {item.parts.map((p, i) => p === 'BLANK' ? (
            <span key={i} style={{
              display: 'inline-block',
              minWidth: 96, textAlign: 'center',
              padding: '2px 12px',
              borderBottom: '2px solid var(--ink)',
              background: picked ? (picked === item.answer ? 'rgba(108,122,74,.18)' : 'rgba(138,58,58,.15)') : 'var(--paper-light)',
              borderRadius: '4px 4px 0 0',
              fontFamily: 'var(--serif-jp)',
              color: picked ? 'var(--ink)' : 'var(--ink-4)'
            }}>
              {picked || '______'}
            </span>
          ) : <span key={i}>{p}</span>)}
        </div>
        <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginTop: 12, fontSize: 14 }}>
          hint: <span style={{ color: 'var(--ink-3)' }}>"…{item.gloss}…"</span>
        </div>

        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {item.choices.map(c => {
            const isAnswer = c === item.answer;
            const isPicked = c === picked;
            let bg = 'var(--card)', color = 'var(--ink)', border = 'var(--line)';
            if (picked) {
              if (isAnswer) { bg = 'rgba(108,122,74,.15)'; border = 'var(--moss)'; }
              else if (isPicked) { bg = 'rgba(138,58,58,.12)'; border = 'var(--rouge)'; }
              else { color = 'var(--ink-4)'; }
            }
            return (
              <button key={c} onClick={() => pick(c)} disabled={!!picked}
                style={{
                  padding: '14px 18px', borderRadius: 8, border: '1px solid', borderColor: border,
                  background: bg, color, cursor: picked ? 'default' : 'pointer',
                  fontFamily: 'var(--serif-jp)', fontSize: 22, fontWeight: 500
                }}>{c}</button>
            );
          })}
        </div>

        {picked && (
          <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px dashed var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {picked === item.answer
                ? <span className="en-disp" style={{ color: 'var(--moss)', fontSize: 18 }}>✓ Correct</span>
                : <>
                    <span className="en-disp" style={{ color: 'var(--rouge)', fontSize: 18 }}>✗ Not quite</span>
                    <span className="en-disp" style={{ color: 'var(--ink-4)', fontStyle: 'italic', marginLeft: 12 }}>
                      → answer: <b className="jp" style={{ color: 'var(--ink)' }}>{item.answer}</b>
                    </span>
                  </>}
            </div>
            <button className="btn btn-primary" onClick={next}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────────────── CONJUGATE ───────────────────── */

// flatten into a series of prompts {word, type, target, ans, en}
const buildConjQueue = () => {
  const list = [];
  for (const w of window.N3_CONJ) {
    for (const p of w.prompts) list.push({ word: w.word, type: w.type, ...p });
  }
  // shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const Conjugate = () => {
  const [queue, setQueue] = uS2(() => buildConjQueue());
  const [idx, setIdx] = uS2(0);
  const [input, setInput] = uS2('');
  const [result, setResult] = uS2(null); // 'right' | 'wrong' | null
  const [score, setScore] = uS2({ right: 0, wrong: 0 });
  const inputRef = uR2(null);

  const item = queue[idx];

  uE2(() => { inputRef.current?.focus(); }, [idx]);

  const submit = () => {
    if (result) return;
    if (!input.trim()) return;
    const ok = input.trim() === item.ans;
    setResult(ok ? 'right' : 'wrong');
    setScore(s => ok ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 });
  };
  const next = () => {
    if (idx + 1 >= queue.length) {
      setQueue(buildConjQueue()); setIdx(0);
    } else setIdx(i => i + 1);
    setInput(''); setResult(null);
  };
  const skip = () => { setResult('wrong'); setScore(s => ({ ...s, wrong: s.wrong + 1 })); };

  return (
    <div data-screen-label="09 Conjugate">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">活用</span>Conjugate</h1>
          <div className="page-sub">Verbs and adjectives — type the form</div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span className="mono" style={{ color: 'var(--moss)' }}>● {score.right}</span>
          <span className="mono" style={{ color: 'var(--rouge)' }}>● {score.wrong}</span>
          <span className="mono" style={{ color: 'var(--ink-4)' }}>{idx + 1}/{queue.length}</span>
        </div>
      </div>

      <div className="card raised" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 56px 38px' }}>
        <div className="label" style={{ marginBottom: 10 }}>{item.type}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <span className="jp-disp" style={{ fontSize: 64 }}>{item.word}</span>
          <span className="en-disp" style={{ fontSize: 20, color: 'var(--ink-4)', fontStyle: 'italic' }}>→ {item.target}</span>
        </div>
        <div className="en-disp" style={{ fontSize: 14, color: 'var(--ink-4)', fontStyle: 'italic', marginTop: 6 }}>"{item.en}"</div>

        <div style={{ marginTop: 36 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') result ? next() : submit(); }}
            placeholder="…"
            readOnly={!!result}
            style={{
              width: '100%', padding: '18px 22px',
              fontFamily: 'var(--serif-jp)', fontSize: 30, fontWeight: 500,
              border: '1px solid', borderColor:
                result === 'right' ? 'var(--moss)' :
                result === 'wrong' ? 'var(--rouge)' : 'var(--line)',
              background: 'var(--paper-light)', color: 'var(--ink)',
              borderRadius: 10, outline: 'none', textAlign: 'center'
            }}
          />
        </div>

        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ minHeight: 28 }}>
            {result === 'right' && <span className="en-disp" style={{ color: 'var(--moss)', fontSize: 18 }}>✓ Correct</span>}
            {result === 'wrong' && (
              <>
                <span className="en-disp" style={{ color: 'var(--rouge)', fontSize: 18 }}>✗</span>
                <span className="en-disp" style={{ color: 'var(--ink-4)', fontStyle: 'italic', marginLeft: 10 }}>
                  → <b className="jp" style={{ color: 'var(--ink)', fontSize: 22 }}>{item.ans}</b>
                </span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {!result && <button className="btn btn-ghost" onClick={skip}>Show answer</button>}
            {!result
              ? <button className="btn btn-primary" onClick={submit}>Check · <span className="mono">↵</span></button>
              : <button className="btn btn-primary" onClick={next}>Next · <span className="mono">↵</span></button>}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--ink-4)', fontSize: 12 }}>
        Type in Japanese (IME on). Hit <span className="mono">↵</span> to check / advance.
      </div>
    </div>
  );
};

/* ───────────────────── MOCK TEST ───────────────────── */

function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const buildMock = () => {
  const vocab = shuffle(window.N3_VOCAB).slice(0, 8);
  const vocabQ = vocab.map(v => {
    const distractors = shuffle(window.N3_VOCAB.filter(x => x.jp !== v.jp)).slice(0, 3).map(x => x.en);
    return {
      section: 'Vocabulary', prompt: v.jp, sub: v.kana,
      question: 'Choose the correct meaning.',
      choices: shuffle([v.en, ...distractors]),
      answer: v.en
    };
  });

  const gram = shuffle(window.N3_CLOZE).slice(0, 6).map(c => ({
    section: 'Grammar',
    prompt: c.parts.map(p => p === 'BLANK' ? '＿＿＿' : p).join(''),
    sub: '"' + c.gloss + '"',
    question: 'Choose the grammar that fills the blank.',
    choices: c.choices, answer: c.answer
  }));

  // Reading: pick one passage; ask 2 comprehension Qs as MC
  const r = window.N3_READING[Math.floor(Math.random() * window.N3_READING.length)];
  const rText = r.tokens.map(t => typeof t === 'string' ? t : t.k).join('');
  const readQ = [{
    section: 'Reading', passage: rText, passageTitle: r.title,
    prompt: 'Comprehension', sub: r.en_title,
    question: 'Which best matches the passage?',
    choices: shuffle([
      r.translation.split('.')[0] + '.',
      'A character regrets a decision and cannot move on.',
      'The narrator describes a crowded train station at rush hour.',
      'A debate about modern technology and traditional values.'
    ]),
    answer: r.translation.split('.')[0] + '.'
  }];

  // Listening: 3 from dialogues — play audio, choose what was discussed
  const dchoices = shuffle(window.N3_DIALOGUES).slice(0, 3);
  const lstQ = dchoices.map(d => {
    const correct = d.en_title;
    const distractors = shuffle(window.N3_DIALOGUES.filter(x => x.en_title !== correct))
      .slice(0, 3).map(x => x.en_title);
    return {
      section: 'Listening', listenScript: d.turns.map(t => t.jp).join(' '),
      prompt: '▶  Press play, then choose',
      sub: 'Listen carefully — what is the topic?',
      question: 'What is this conversation about?',
      choices: shuffle([correct, ...distractors]),
      answer: correct
    };
  });

  return [...vocabQ, ...gram, ...readQ, ...lstQ];
};

const Mock = () => {
  const [phase, setPhase] = uS2('intro');     // intro|test|result
  const [qs, setQs] = uS2([]);
  const [idx, setIdx] = uS2(0);
  const [answers, setAnswers] = uS2({});
  const [timeLeft, setTimeLeft] = uS2(20 * 60);   // 20 min
  const tickRef = uR2(null);

  uE2(() => {
    if (phase !== 'test') return;
    tickRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(tickRef.current); finish(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(tickRef.current);
  }, [phase]);

  const begin = () => {
    setQs(buildMock()); setIdx(0); setAnswers({}); setTimeLeft(20 * 60); setPhase('test');
  };
  const finish = () => {
    clearInterval(tickRef.current);
    setPhase('result');
  };
  const pick = (c) => { setAnswers(a => ({ ...a, [idx]: c })); };

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (phase === 'intro') {
    return (
      <div data-screen-label="10 Mock">
        <div className="page-head">
          <div>
            <h1 className="page-title"><span className="kanji">模試</span>Mock test</h1>
            <div className="page-sub">A short JLPT N3-style mock</div>
          </div>
        </div>
        <div className="card raised" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 48px', textAlign: 'center' }}>
          <div className="jp-disp" style={{ fontSize: 48 }}>準備はいい？</div>
          <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 18, marginTop: 8 }}>"Ready to begin?"</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, margin: '36px 0' }}>
            {[
              { k: '語彙', en: 'Vocab', n: '8 Q' },
              { k: '文法', en: 'Grammar', n: '6 Q' },
              { k: '読解', en: 'Reading', n: '1 Q' },
              { k: '聴解', en: 'Listening', n: '3 Q' }
            ].map(s => (
              <div key={s.k} style={{ padding: '16px 8px', border: '1px solid var(--line)', borderRadius: 8 }}>
                <div className="jp-disp" style={{ fontSize: 28 }}>{s.k}</div>
                <div className="mono" style={{ color: 'var(--ink-4)', marginTop: 6 }}>{s.en.toUpperCase()}</div>
                <div className="en-disp" style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>{s.n}</div>
              </div>
            ))}
          </div>
          <div className="en-disp" style={{ color: 'var(--ink-4)', fontStyle: 'italic', fontSize: 14, marginBottom: 24 }}>
            20-minute timer · 18 questions · partial credit by section
          </div>
          <button className="btn btn-primary" onClick={begin} style={{ fontSize: 15, padding: '14px 28px' }}>Begin mock test →</button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const bySection = {};
    qs.forEach((q, i) => {
      bySection[q.section] = bySection[q.section] || { right: 0, total: 0 };
      bySection[q.section].total++;
      if (answers[i] === q.answer) bySection[q.section].right++;
    });
    const totalRight = Object.values(bySection).reduce((a, s) => a + s.right, 0);
    const totalQ = qs.length;
    const pct = Math.round(100 * totalRight / totalQ);

    return (
      <div data-screen-label="10 Mock">
        <div className="page-head">
          <div>
            <h1 className="page-title"><span className="kanji">結果</span>Results</h1>
            <div className="page-sub">Mock test · {fmt(20*60 - timeLeft)} spent</div>
          </div>
          <button className="btn" onClick={() => setPhase('intro')}>Try again →</button>
        </div>
        <div className="card raised" style={{ padding: '40px 48px', marginBottom: 22, textAlign: 'center' }}>
          <div className="label" style={{ marginBottom: 12 }}>Overall</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16 }}>
            <span className="en-disp" style={{ fontSize: 96, lineHeight: 1, color: pct >= 60 ? 'var(--moss)' : pct >= 40 ? 'var(--persimmon)' : 'var(--rouge)' }}>{pct}%</span>
            <span className="mono" style={{ color: 'var(--ink-4)' }}>{totalRight} / {totalQ}</span>
          </div>
        </div>
        <div className="card raised" style={{ padding: 0 }}>
          {Object.entries(bySection).map(([sec, s], i) => (
            <div key={sec} style={{
              padding: '20px 28px', display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 22,
              alignItems: 'center',
              borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)'
            }}>
              <div className="en-disp" style={{ fontSize: 20 }}>{sec}</div>
              <div style={{ height: 8, background: 'var(--line-soft)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${100 * s.right / s.total}%`, height: '100%', background: 'var(--ink)' }} />
              </div>
              <span className="mono" style={{ color: 'var(--ink-3)' }}>{s.right}/{s.total}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="label" style={{ marginBottom: 10 }}>Question review</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {qs.map((q, i) => {
              const ok = answers[i] === q.answer;
              return (
                <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '24px 90px 1fr 1fr', gap: 14, padding: '12px 18px', alignItems: 'center' }}>
                  <span style={{ color: ok ? 'var(--moss)' : 'var(--rouge)' }}>{ok ? '✓' : '✗'}</span>
                  <span className="mono" style={{ color: 'var(--ink-4)' }}>{q.section.toUpperCase()}</span>
                  <span className="jp" style={{ fontSize: 14 }}>{q.prompt}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    your: <b className="jp">{answers[i] || '—'}</b> · ans: <b className="jp">{q.answer}</b>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // test phase
  const q = qs[idx];
  const onPlay = () => q.listenScript && window.speakJP(q.listenScript, 0.9);

  return (
    <div data-screen-label="10 Mock">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">模試</span>Mock test</h1>
          <div className="page-sub">Question {idx + 1} of {qs.length} · <b>{q.section}</b></div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span className="mono" style={{ color: timeLeft < 60 ? 'var(--rouge)' : 'var(--ink-3)', fontSize: 14 }}>⏱ {fmt(timeLeft)}</span>
          <button className="btn" onClick={finish}>End early</button>
        </div>
      </div>

      <div className="card raised" style={{ maxWidth: 820, margin: '0 auto', padding: '36px 48px' }}>
        {q.passage && (
          <div style={{ padding: '18px 22px', background: 'var(--paper-light)', borderLeft: '2px solid var(--ink-3)', borderRadius: '0 6px 6px 0', marginBottom: 22 }}>
            <div className="label" style={{ marginBottom: 6 }}>Passage · {q.passageTitle}</div>
            <div className="jp" style={{ fontSize: 17, lineHeight: 1.8 }}>{q.passage}</div>
          </div>
        )}
        {q.listenScript && (
          <div style={{ padding: '18px 22px', background: 'var(--paper-light)', borderLeft: '2px solid var(--indigo)', borderRadius: '0 6px 6px 0', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="label">Audio</div>
              <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>You may replay the clip.</div>
            </div>
            <button className="btn btn-primary" onClick={onPlay}>▶ Play</button>
          </div>
        )}
        <div className="label" style={{ marginBottom: 6 }}>{q.section}</div>
        <div className="jp-disp" style={{ fontSize: 30, lineHeight: 1.4 }}>{q.prompt}</div>
        {q.sub && <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-4)', marginTop: 4 }}>{q.sub}</div>}
        <div className="en-disp" style={{ marginTop: 18, color: 'var(--ink-2)', fontSize: 16 }}>{q.question}</div>

        <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
          {q.choices.map((c, i) => {
            const picked = answers[idx] === c;
            return (
              <button key={i} onClick={() => pick(c)} style={{
                padding: '14px 18px', borderRadius: 8, textAlign: 'left',
                border: '1px solid', borderColor: picked ? 'var(--ink)' : 'var(--line)',
                background: picked ? 'rgba(26,24,20,.05)' : 'var(--card)',
                cursor: 'pointer',
                display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, alignItems: 'center'
              }}>
                <span className="mono" style={{ color: 'var(--ink-4)' }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ fontFamily: /[\u3000-\u9faf]/.test(c) ? 'var(--serif-jp)' : 'var(--serif-en)', fontSize: 16 }}>{c}</span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 26, paddingTop: 18, borderTop: '1px dashed var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>← Prev</button>
          <div style={{ display: 'flex', gap: 4 }}>
            {qs.map((_, i) => (
              <span key={i} onClick={() => setIdx(i)} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: answers[i] ? 'var(--ink)' : 'var(--line)',
                outline: i === idx ? '2px solid var(--ink)' : 'none',
                outlineOffset: 2, cursor: 'pointer'
              }} />
            ))}
          </div>
          {idx === qs.length - 1
            ? <button className="btn btn-primary" onClick={finish}>Submit ✓</button>
            : <button className="btn btn-primary" onClick={() => setIdx(i => i + 1)}>Next →</button>}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────── IMPORT / EXPORT ───────────────────── */

const ImportExport = () => {
  const [csv, setCsv] = uS2('');
  const [imported, setImported] = uS2([]);
  const [imsg, setImsg] = uS2('');
  const fileRef = uR2(null);

  const IMPORT_KEY = 'sumi.n3.userdeck.v1';
  uE2(() => {
    try { setImported(JSON.parse(localStorage.getItem(IMPORT_KEY) || '[]')); } catch {}
  }, []);

  const parseCsv = (txt) => {
    const rows = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return rows.map(r => {
      const cols = r.split(/\t|,/).map(c => c.trim());
      const [jp, kana, en, ex_jp = '', ex_en = ''] = cols;
      return { jp, kana, en, pos: 'user', ex: { jp: ex_jp, en: ex_en } };
    }).filter(x => x.jp && x.en);
  };

  const doImport = () => {
    const parsed = parseCsv(csv);
    if (!parsed.length) { setImsg('No valid rows found. Each line: word, reading, meaning, [example_jp], [example_en]'); return; }
    const merged = [...imported, ...parsed];
    localStorage.setItem(IMPORT_KEY, JSON.stringify(merged));
    setImported(merged);
    // also merge into runtime vocab pool
    window.N3_VOCAB = (window.N3_VOCAB || []).concat(parsed);
    setCsv('');
    setImsg(`Added ${parsed.length} item${parsed.length === 1 ? '' : 's'} to your deck.`);
  };
  const clearImport = () => {
    localStorage.removeItem(IMPORT_KEY); setImported([]); setImsg('User deck cleared.');
  };
  const onFile = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setCsv(await f.text());
  };

  // PROGRESS EXPORT
  const exportProgress = () => {
    const data = {
      exported: new Date().toISOString(),
      srs: SRS.load(),
      userDeck: imported,
      app: 'sumi.n3', version: 1
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `sumi-n3-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importProgress = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (data.srs) { localStorage.setItem(SRS_KEY, JSON.stringify(data.srs)); }
      if (data.userDeck) {
        localStorage.setItem(IMPORT_KEY, JSON.stringify(data.userDeck));
        setImported(data.userDeck);
      }
      setImsg('Progress restored — switch to Cards to see it.');
    } catch (err) {
      setImsg('Could not parse file.');
    }
  };

  // SRS stats
  const srs = SRS.load();
  const srsCount = Object.keys(srs).length;
  const totalReps = Object.values(srs).reduce((a, s) => a + (s.reps || 0), 0);

  return (
    <div data-screen-label="11 Import">
      <div className="page-head">
        <div>
          <h1 className="page-title"><span className="kanji">入出</span>Import &amp; export</h1>
          <div className="page-sub">Bring your own list · save your progress</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 22 }}>
        {/* IMPORT */}
        <div className="card raised">
          <div className="label" style={{ marginBottom: 8 }}>Import vocab list</div>
          <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-3)', marginBottom: 14, fontSize: 14 }}>
            Paste CSV or TSV. Each row: <span className="mono">word, reading, meaning, [example_jp], [example_en]</span>
          </div>
          <textarea
            value={csv}
            onChange={e => setCsv(e.target.value)}
            placeholder={'例:\n調子,ちょうし,condition,体の調子が悪い,My condition is bad\n機嫌,きげん,mood,...,...'}
            style={{
              width: '100%', minHeight: 180, padding: 14,
              fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7,
              background: 'var(--paper-light)', border: '1px solid var(--line)',
              borderRadius: 8, resize: 'vertical', color: 'var(--ink)'
            }}
          />
          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={doImport}>Add to deck</button>
            <button className="btn" onClick={() => fileRef.current?.click()}>Load .csv / .tsv</button>
            <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" style={{ display: 'none' }} onChange={onFile} />
            {imported.length > 0 && (
              <button className="btn btn-ghost" onClick={clearImport}>Clear user deck</button>
            )}
            {imsg && <span className="en-disp" style={{ fontStyle: 'italic', color: 'var(--moss)', fontSize: 13 }}>{imsg}</span>}
          </div>
          {imported.length > 0 && (
            <div style={{ marginTop: 14, padding: 12, background: 'var(--paper-light)', borderRadius: 8, fontSize: 12 }}>
              <span className="mono" style={{ color: 'var(--ink-4)' }}>USER DECK · {imported.length} items</span>
              <div style={{ marginTop: 6, color: 'var(--ink-3)' }}>
                {imported.slice(0, 5).map((x, i) => <span key={i} className="jp" style={{ marginRight: 10 }}>{x.jp}</span>)}
                {imported.length > 5 && <span className="mono">+{imported.length - 5} more</span>}
              </div>
            </div>
          )}
        </div>

        {/* EXPORT */}
        <div className="card raised">
          <div className="label" style={{ marginBottom: 8 }}>Progress</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
            <div>
              <div className="mono" style={{ color: 'var(--ink-4)' }}>CARDS STUDIED</div>
              <div className="en-disp" style={{ fontSize: 36, lineHeight: 1 }}>{srsCount}</div>
            </div>
            <div>
              <div className="mono" style={{ color: 'var(--ink-4)' }}>TOTAL REVIEWS</div>
              <div className="en-disp" style={{ fontSize: 36, lineHeight: 1 }}>{totalReps}</div>
            </div>
          </div>
          <div className="en-disp" style={{ fontStyle: 'italic', color: 'var(--ink-3)', marginBottom: 14, fontSize: 14 }}>
            Save a JSON snapshot of your SRS state and imported deck. Restore from another device or after clearing browser data.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={exportProgress}>↓ Export progress</button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              ↑ Restore from JSON
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={importProgress} />
            </label>
          </div>
        </div>
      </div>

      {/* Format reference */}
      <div className="card">
        <div className="label" style={{ marginBottom: 10 }}>Format reference</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.8, color: 'var(--ink-3)', whiteSpace: 'pre-wrap' }}>
{`# CSV / TSV — one entry per line, commas or tabs separate
# columns: word, reading, meaning, example_jp (opt), example_en (opt)

調子, ちょうし, condition, 体の調子が悪い, My condition is bad
機嫌, きげん, mood
...

# Anki tip: in your deck → File → Export → "Notes in Plain Text"
# uncheck HTML; the result drops in here cleanly.`}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────── EXPORT all ───────────────────── */
Object.assign(window, {
  // replacements
  Cards: Cards2,
  Listening: Listening2,
  // new
  Cloze, Conjugate, Mock, ImportExport,
  SRS
});
