# Japanese Study App

_Started 2026-05-11 12:28 UTC_

---

## User

SOMETHING THATLL HELP ME TO STUDY AND LEARN JAPANESE

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: questions_v2]_

## User

Questions answered:
- level: Intermediate (basic kanji + grammar)
- focus: Kanji, Vocabulary (flashcards), Grammar, Sentence reading, Listening, Speaking / pronunciation, IM CURRENTLY STUDYING FOR THE N3 JLPT SO ANYHTING THATLL HELP
- format: I LIKE ALL OF THE OPTIONS ABOVE
- vibe: Calm / minimal (washi, sumi-e ink, muted)
- interactivity: Decide for me
- content_source: GENERATE JLPT N3 STUFF, GRAMMAR, VOCAB, AND EVEN NATIVE LIKE PHRASES
- scope: Decide for me
- device: Decide for me
- novelty: Familiar patterns (Anki/Duolingo/WaniKani style)
- variations: Decide for me

## Assistant

_[tool: update_todos]_

Got it. Building a calm, sumi-e inspired JLPT N3 study app — desktop web app with a sidebar of modes (Today, Cards, Kanji, Grammar, Reading, Listening, Speaking). I'll keep the palette muted (washi cream + sumi ink + faded indigo/persimmon) with Shippori Mincho for Japanese and Newsreader/Inter for the UI.

Let me plan and build.

_[tool: copy_starter_component]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built a calm sumi-e–inspired JLPT N3 study app: **Today** dashboard, **Cards** (SRS flashcards with reveal + 4-grade rating + keyboard shortcuts), **Kanji** browser with detail (on/kun/strokes/compounds), **Grammar** (N3 patterns w/ forms + examples), **Reading** (3 passages with furigana toggle + translation reveal), **Listening** (Japanese TTS + speed control + transcript hide), and **Native phrases**. Tweaks panel exposes 3 palettes (Washi / Sumi dark / Shoji), density, default furigana, TTS speed.

Audio uses browser speech synthesis — Japanese voice quality depends on OS (macOS/Windows ship good ones; Linux may need extra voice packs).

Next steps if you want them: writing-practice canvas for kanji stroke order, mock test mode, or import your own vocab list.

## User

look good anyhting else we could add to improve on

## Assistant

_[tool: snip]_

Some directions that would meaningfully level it up for N3 prep:

**High-value additions**
- **Mock test mode** — timed N3 sections (語彙・文法・読解・聴解) with score, weak-area breakdown
- **Kanji writing canvas** — drag-to-draw with stroke-count check; or animated stroke order
- **Sentence mining / cloze** — fill-in-the-blank drills generated from your vocab
- **Pitch accent markers** on vocab (high-bar notation) — N3-era pronunciation polish
- **Speaking practice** with Web Speech recognition: shadow a line, get a match score

**Quality-of-life**
- **Real SRS engine** that persists to `localStorage` (currently the grade buttons are visual only)
- **Search bar** (⌘K) across vocab/kanji/grammar
- **Import your own list** (paste CSV / Anki .txt) to merge with the N3 corpus
- **Progress export** so you can see your trajectory week-over-week
- **Conjugation drill** (verb/adjective forms — ます, て, た, ば, させる, …)

**Content depth**
- Expand to the full ~1,800 N3 vocab and ~370 kanji
- Long-form reading passages with comprehension questions (matches the real test format)
- Listening dialogues (2-speaker turns) instead of single lines

Want me to build any of these? I'd suggest **mock test mode + persistent SRS** first — biggest jump in usefulness for actual JLPT prep.

## User

add entence mining / cloze, Mock test mode, and more content added for reading, listening, phrases, Real SRS engine, Import your own list option, Progress export, extensive Conjugation drill, Expand to the full, Listening dialogues (2-speaker turns) instead of single lines

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: read_file]_

## Assistant

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Added: real SRS engine (Cards now use SM-2 with localStorage persistence, due/new counts, interval preview per grade), 2-speaker dialogues in Listening with auto-play through turns, Cloze sentence-mining with multiple choice and feedback, Conjugation drill (verbs/i-adj/na-adj across past, te-form, negative, potential, passive, causative, volitional, conditional), 20-minute Mock test (vocab + grammar + reading + listening sections with score breakdown), Import/Export screen for CSV/TSV vocab lists and JSON progress backup, expanded vocab/kanji/phrases pools.

## User

now how can i make it personal? it has a streak already made. i want to start from scrtach andwork my way up

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: list_files]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: write_file]_

Now I'll add a personal layer: an onboarding modal, a Stats engine that persists everything, a dynamic Today screen, a real streak that lives on `localStorage`, and a "Start over" link in the sidebar.

