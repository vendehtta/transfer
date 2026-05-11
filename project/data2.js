// Expansion content + new categories: more vocab/kanji/phrases/readings,
// 2-speaker dialogues, cloze items, conjugation drill set.

// ── EXTRA VOCAB (appended to N3_VOCAB at runtime) ──────────────────────────
window.N3_VOCAB_EXTRA = [
  { jp: '溜まる', kana: 'たまる', en: 'to accumulate; to pile up', pos: 'verb', ex: { jp: '仕事が溜まっている。', en: 'Work is piling up.' } },
  { jp: '我慢', kana: 'がまん', en: 'patience; endurance', pos: 'noun', ex: { jp: 'もう少し我慢して。', en: 'Bear with it a little longer.' } },
  { jp: '訪ねる', kana: 'たずねる', en: 'to visit', pos: 'verb', ex: { jp: '先生を訪ねた。', en: 'I visited my teacher.' } },
  { jp: '比べる', kana: 'くらべる', en: 'to compare', pos: 'verb', ex: { jp: '値段を比べる。', en: 'To compare prices.' } },
  { jp: '失敗', kana: 'しっぱい', en: 'failure; mistake', pos: 'noun', ex: { jp: '失敗を恐れるな。', en: "Don't fear failure." } },
  { jp: '成功', kana: 'せいこう', en: 'success', pos: 'noun', ex: { jp: '実験に成功した。', en: 'The experiment succeeded.' } },
  { jp: '記録', kana: 'きろく', en: 'record; document', pos: 'noun', ex: { jp: '記録を残す。', en: 'To leave a record.' } },
  { jp: '希望', kana: 'きぼう', en: 'hope; wish', pos: 'noun', ex: { jp: '希望を持つ。', en: 'To hold hope.' } },
  { jp: '案内', kana: 'あんない', en: 'guidance; showing around', pos: 'noun', ex: { jp: '町を案内する。', en: 'To show around town.' } },
  { jp: '預ける', kana: 'あずける', en: 'to entrust; to deposit', pos: 'verb', ex: { jp: '荷物を預ける。', en: 'To check my luggage.' } },
  { jp: '謝る', kana: 'あやまる', en: 'to apologize', pos: 'verb', ex: { jp: '友達に謝った。', en: 'I apologized to my friend.' } },
  { jp: '違反', kana: 'いはん', en: 'violation; breach', pos: 'noun', ex: { jp: '交通違反。', en: 'Traffic violation.' } },
  { jp: '苦労', kana: 'くろう', en: 'hardship; difficulty', pos: 'noun', ex: { jp: '苦労して育てた。', en: 'I raised them through hardship.' } },
  { jp: '汚い', kana: 'きたない', en: 'dirty', pos: 'i-adj', ex: { jp: '部屋が汚い。', en: 'The room is dirty.' } },
  { jp: '素敵', kana: 'すてき', en: 'lovely; wonderful', pos: 'na-adj', ex: { jp: '素敵な景色。', en: 'A wonderful view.' } },
  { jp: '驚く', kana: 'おどろく', en: 'to be surprised', pos: 'verb', ex: { jp: 'ニュースに驚いた。', en: 'I was surprised by the news.' } },
  { jp: '迷う', kana: 'まよう', en: 'to be lost; to hesitate', pos: 'verb', ex: { jp: '道に迷った。', en: 'I got lost.' } },
  { jp: '届く', kana: 'とどく', en: 'to reach; to arrive', pos: 'verb', ex: { jp: '手紙が届いた。', en: 'The letter arrived.' } },
  { jp: '増える', kana: 'ふえる', en: 'to increase', pos: 'verb', ex: { jp: '人口が増えた。', en: 'The population grew.' } },
  { jp: '減る', kana: 'へる', en: 'to decrease', pos: 'verb', ex: { jp: '貯金が減る。', en: 'Savings decrease.' } },
  { jp: '腹', kana: 'はら', en: 'belly; stomach', pos: 'noun', ex: { jp: '腹が立つ。', en: 'To get angry (lit. belly stands).' } },
  { jp: '寂しい', kana: 'さびしい', en: 'lonely', pos: 'i-adj', ex: { jp: '一人で寂しい。', en: 'I am lonely by myself.' } },
  { jp: '丁寧', kana: 'ていねい', en: 'polite; careful', pos: 'na-adj', ex: { jp: '丁寧に説明する。', en: 'Explain politely.' } },
  { jp: '出張', kana: 'しゅっちょう', en: 'business trip', pos: 'noun', ex: { jp: '大阪へ出張する。', en: 'Go on a business trip to Osaka.' } },
  { jp: '夢中', kana: 'むちゅう', en: 'absorbed; engrossed', pos: 'na-adj', ex: { jp: '本に夢中になる。', en: 'To get absorbed in a book.' } },
  { jp: '無理', kana: 'むり', en: 'impossible; unreasonable', pos: 'na-adj', ex: { jp: 'それは無理だ。', en: "That's impossible." } },
  { jp: '余裕', kana: 'よゆう', en: 'room; leeway', pos: 'noun', ex: { jp: '時間に余裕がある。', en: 'I have time to spare.' } },
  { jp: '別れる', kana: 'わかれる', en: 'to part; to break up', pos: 'verb', ex: { jp: '駅で別れた。', en: 'We parted at the station.' } },
  { jp: '渡す', kana: 'わたす', en: 'to hand over', pos: 'verb', ex: { jp: '手紙を渡す。', en: 'To hand over a letter.' } },
  { jp: '勝つ', kana: 'かつ', en: 'to win', pos: 'verb', ex: { jp: '試合に勝った。', en: 'We won the match.' } },
  { jp: '負ける', kana: 'まける', en: 'to lose', pos: 'verb', ex: { jp: '試合に負けた。', en: 'We lost the match.' } },
  { jp: '実は', kana: 'じつは', en: 'actually; the truth is', pos: 'adverb', ex: { jp: '実は知らなかった。', en: "Actually I didn't know." } },
  { jp: '結局', kana: 'けっきょく', en: 'in the end; after all', pos: 'adverb', ex: { jp: '結局行かなかった。', en: "In the end I didn't go." } },
  { jp: '確かに', kana: 'たしかに', en: 'certainly; surely', pos: 'adverb', ex: { jp: '確かに受け取った。', en: 'I have certainly received it.' } },
  { jp: '一応', kana: 'いちおう', en: 'just in case; for now', pos: 'adverb', ex: { jp: '一応確認する。', en: 'I will check just in case.' } }
];

window.N3_KANJI_EXTRA = [
  { c: '訪', on: 'ホウ', kun: 'たず(ねる)・おとず(れる)', en: 'visit, call on', strokes: 11, words: ['訪問', '訪日'] },
  { c: '比', on: 'ヒ', kun: 'くら(べる)', en: 'compare, ratio', strokes: 4, words: ['比較', '比例'] },
  { c: '失', on: 'シツ', kun: 'うしな(う)', en: 'lose, miss, mistake', strokes: 5, words: ['失敗', '失礼', '消失'] },
  { c: '成', on: 'セイ・ジョウ', kun: 'な(る)', en: 'become, succeed', strokes: 6, words: ['成功', '成長', '完成'] },
  { c: '記', on: 'キ', kun: 'しる(す)', en: 'record, write down', strokes: 10, words: ['記録', '日記', '記憶'] },
  { c: '希', on: 'キ', kun: 'まれ', en: 'hope, rare', strokes: 7, words: ['希望', '希少'] },
  { c: '案', on: 'アン', kun: '—', en: 'plan, proposal, guide', strokes: 10, words: ['案内', '提案', '案'] },
  { c: '預', on: 'ヨ', kun: 'あず(ける)', en: 'entrust, deposit', strokes: 13, words: ['預金', '預ける'] },
  { c: '謝', on: 'シャ', kun: 'あやま(る)', en: 'apologize, thank', strokes: 17, words: ['感謝', '謝罪'] },
  { c: '違', on: 'イ', kun: 'ちが(う)', en: 'differ, mistake', strokes: 13, words: ['違反', '間違い', '違法'] },
  { c: '苦', on: 'ク', kun: 'くる(しい)・にが(い)', en: 'suffering, bitter', strokes: 8, words: ['苦労', '苦手', '苦い'] },
  { c: '汚', on: 'オ', kun: 'きたな(い)・よご(す)', en: 'dirty, pollute', strokes: 6, words: ['汚い', '汚染', '汚れ'] },
  { c: '驚', on: 'キョウ', kun: 'おどろ(く)', en: 'astonish, surprise', strokes: 22, words: ['驚く', '驚異', '驚嘆'] },
  { c: '迷', on: 'メイ', kun: 'まよ(う)', en: 'lost, astray, perplexed', strokes: 9, words: ['迷う', '迷子', '迷惑'] },
  { c: '届', on: 'カイ', kun: 'とど(く)・とど(ける)', en: 'deliver, reach', strokes: 8, words: ['届く', '届ける', '欠席届'] },
  { c: '増', on: 'ゾウ', kun: 'ふ(える)・ま(す)', en: 'increase, swell', strokes: 14, words: ['増える', '増加', '増税'] },
  { c: '減', on: 'ゲン', kun: 'へ(る)・へ(らす)', en: 'decrease, reduce', strokes: 12, words: ['減る', '減少', '加減'] },
  { c: '寂', on: 'ジャク・セキ', kun: 'さび(しい)', en: 'lonely, quiet', strokes: 11, words: ['寂しい', '静寂'] },
  { c: '丁', on: 'チョウ・テイ', kun: '—', en: 'street, ward; precise', strokes: 2, words: ['丁寧', '丁度', '一丁目'] },
  { c: '張', on: 'チョウ', kun: 'は(る)', en: 'stretch, spread', strokes: 11, words: ['出張', '主張', '緊張'] },
  { c: '勝', on: 'ショウ', kun: 'か(つ)', en: 'win, prevail', strokes: 12, words: ['勝つ', '優勝', '勝手'] },
  { c: '負', on: 'フ', kun: 'ま(ける)・お(う)', en: 'lose, bear, owe', strokes: 9, words: ['負ける', '負担', '勝負'] }
];

window.N3_PHRASES_EXTRA = [
  { jp: 'お先に失礼します', kana: 'おさきにしつれいします', en: '"Pardon me for leaving first" — leaving work', nuance: 'Said when you leave the office before others.' },
  { jp: 'お邪魔します', kana: 'おじゃまします', en: '"Sorry to intrude" — entering someone\u2019s home', nuance: 'Polite, almost obligatory when visiting.' },
  { jp: 'いただきます', kana: 'いただきます', en: '"I humbly receive" — before eating', nuance: 'A small ritual before any meal.' },
  { jp: 'ごちそうさま', kana: 'ごちそうさま', en: '"It was a feast" — after eating', nuance: 'Closes the meal; said to whoever prepared/paid.' },
  { jp: 'おかげさまで', kana: 'おかげさまで', en: '"Thanks to you" — when things are well', nuance: 'Modest credit-spreading; even toward strangers.' },
  { jp: 'お大事に', kana: 'おだいじに', en: '"Take care of yourself"', nuance: 'Said to someone unwell or recovering.' },
  { jp: 'ご苦労さま', kana: 'ごくろうさま', en: '"Thanks for the trouble"', nuance: 'Used to subordinates — NOT to superiors. Use お疲れさま instead.' },
  { jp: 'お世話になります', kana: 'おせわになります', en: '"I\u2019ll be in your care"', nuance: 'Opens business emails; precedes any new working relationship.' }
];

// ── 2-SPEAKER LISTENING DIALOGUES ─────────────────────────────────────────
window.N3_DIALOGUES = [
  {
    title: 'カフェにて',
    en_title: 'At a Café',
    turns: [
      { s: 'A', jp: 'いらっしゃいませ。ご注文はお決まりですか。', en: 'Welcome. Have you decided on your order?' },
      { s: 'B', jp: 'えーと、ホットコーヒーを一つお願いします。', en: 'Um, one hot coffee please.' },
      { s: 'A', jp: 'サイズはいかがなさいますか。', en: 'And what size would you like?' },
      { s: 'B', jp: '一番小さいので大丈夫です。', en: 'The smallest one is fine.' },
      { s: 'A', jp: '店内でお召し上がりですか。', en: 'Will you be having it here?' },
      { s: 'B', jp: 'はい、ここで飲みます。', en: "Yes, I'll drink it here." }
    ]
  },
  {
    title: '道を聞く',
    en_title: 'Asking Directions',
    turns: [
      { s: 'A', jp: 'すみません、この近くに郵便局はありますか。', en: 'Excuse me, is there a post office near here?' },
      { s: 'B', jp: 'はい、ありますよ。この道をまっすぐ行ってください。', en: 'Yes, there is. Go straight down this road.' },
      { s: 'A', jp: 'どのくらいかかりますか。', en: 'How long does it take?' },
      { s: 'B', jp: '歩いて五分ぐらいです。二つ目の信号の右側にあります。', en: 'About five minutes on foot. It is on the right at the second traffic light.' },
      { s: 'A', jp: 'ありがとうございました。', en: 'Thank you very much.' }
    ]
  },
  {
    title: '電話で予約',
    en_title: 'Booking by Phone',
    turns: [
      { s: 'A', jp: 'はい、さくらレストランです。', en: 'Hello, Sakura Restaurant.' },
      { s: 'B', jp: '予約をお願いしたいんですが。', en: "I'd like to make a reservation." },
      { s: 'A', jp: 'いつのご予約でしょうか。', en: 'For when, please?' },
      { s: 'B', jp: '今週の土曜日の七時から、三人でお願いします。', en: 'This Saturday from seven, for three people.' },
      { s: 'A', jp: '少々お待ちください。…はい、ご用意できます。', en: 'One moment please. …Yes, we can accommodate you.' },
      { s: 'B', jp: 'よろしくお願いします。', en: 'Thank you, much appreciated.' }
    ]
  },
  {
    title: '体調を気にかける',
    en_title: 'Checking on Wellbeing',
    turns: [
      { s: 'A', jp: '顔色が悪いね。大丈夫？', en: "You look pale. Are you OK?" },
      { s: 'B', jp: 'うん、ちょっと頭が痛いだけ。', en: 'Yeah, my head just hurts a bit.' },
      { s: 'A', jp: '無理しないで、早く帰ったほうがいいよ。', en: "Don't push yourself, you should head home early." },
      { s: 'B', jp: 'そうだね。あとでそうするよ。ありがとう。', en: "You're right. I'll do that later. Thanks." }
    ]
  },
  {
    title: '友達を誘う',
    en_title: 'Inviting a Friend',
    turns: [
      { s: 'A', jp: '今度の週末、暇？映画でも見に行かない？', en: 'Free this weekend? Want to go see a movie or something?' },
      { s: 'B', jp: '行きたいけど、土曜日はバイトがあるんだ。', en: "I want to, but I have a part-time job on Saturday." },
      { s: 'A', jp: 'じゃあ日曜日はどう？', en: 'How about Sunday then?' },
      { s: 'B', jp: '日曜日なら大丈夫。何時にしようか。', en: 'Sunday works. What time should we make it?' },
      { s: 'A', jp: '二時にしよう。駅前で待ち合わせね。', en: "Let's say two. Let's meet in front of the station." }
    ]
  },
  {
    title: '忘れ物',
    en_title: 'A Lost Item',
    turns: [
      { s: 'A', jp: 'すみません、ここに傘を忘れたんですが。', en: 'Excuse me, I left an umbrella here.' },
      { s: 'B', jp: '何色の傘ですか。', en: 'What color was it?' },
      { s: 'A', jp: '黒い長い傘で、持ち手が木でできています。', en: "It's a long black umbrella with a wooden handle." },
      { s: 'B', jp: 'ああ、これですね。お預かりしていました。', en: 'Ah, this one? We had been holding it.' },
      { s: 'A', jp: 'あ、それです。助かりました、ありがとうございます。', en: "Yes, that's it. What a relief — thank you." }
    ]
  }
];

// ── CLOZE (sentence with one slot to fill) ────────────────────────────────
// each item: sentence parts separated by `BLANK`, correct answer, distractors
window.N3_CLOZE = [
  { parts: ['若い', 'BLANK', '、いろいろな経験をしたほうがいい。'], answer: 'うちに', choices: ['うちに', 'ところに', 'おかげで', 'せいで'], gloss: 'while you are young' },
  { parts: ['先生の', 'BLANK', '、合格できました。'], answer: 'おかげで', choices: ['おかげで', 'せいで', 'ために', 'うちに'], gloss: 'thanks to my teacher' },
  { parts: ['雨の', 'BLANK', '、試合が中止になった。'], answer: 'せいで', choices: ['せいで', 'おかげで', 'うちに', 'について'], gloss: 'because of the rain' },
  { parts: ['日本に来た', 'BLANK', 'なのに、もう日本語が上手だ。'], answer: 'ばかり', choices: ['ばかり', 'ところ', 'はず', 'らしい'], gloss: 'just arrived' },
  { parts: ['物価は上がる', 'BLANK', 'だ。'], answer: 'ばかり', choices: ['ばかり', 'だけ', 'うち', 'ほど'], gloss: 'only goes up' },
  { parts: ['毎日運動する', 'BLANK', 'している。'], answer: 'ように', choices: ['ように', 'ために', 'ことに', 'そうに'], gloss: 'make a point of' },
  { parts: ['日本語が話せる', 'BLANK', 'なった。'], answer: 'ように', choices: ['ように', 'そうに', 'ことに', 'はずに'], gloss: 'came to be able' },
  { parts: ['お金', 'BLANK', 'あれば、旅行に行ける。'], answer: 'さえ', choices: ['さえ', 'だけ', 'しか', 'こそ'], gloss: 'as long as' },
  { parts: ['日本の文化', 'BLANK', '研究しています。'], answer: 'について', choices: ['について', 'にとって', 'によって', 'に対して'], gloss: 'about' },
  { parts: ['私', 'BLANK', '、家族が一番大切だ。'], answer: 'にとって', choices: ['にとって', 'について', 'によって', 'にしては'], gloss: 'for me' },
  { parts: ['田中さんは来ない', 'BLANK', '。'], answer: 'らしい', choices: ['らしい', 'そうだ', 'ようだ', 'みたい'], gloss: 'apparently' },
  { parts: ['彼は相変わらず', 'BLANK', 'だ。'], answer: '元気', choices: ['元気', '元の気', '気元', '気の元'], gloss: 'as energetic as ever' },
  { parts: ['駐車', 'BLANK', 'の看板を見落とした。'], answer: '禁止', choices: ['禁止', '禁断', '中止', '停止'], gloss: 'no parking' },
  { parts: ['彼の状態は悪くなる', 'BLANK', 'だ。'], answer: 'ばかり', choices: ['ばかり', 'ところ', 'はず', 'よう'], gloss: 'only gets worse' },
  { parts: ['電車に乗り遅れない', 'BLANK', 'に走った。'], answer: 'よう', choices: ['よう', 'はず', 'こと', 'ため'], gloss: "so as not to" }
];

// ── CONJUGATION DRILL ──────────────────────────────────────────────────────
// fromForm — dictionary form, targetForm — what to produce
// type tells the screen how to render the prompt
window.N3_CONJ = [
  // u-verbs (Group 1)
  { word: '行く', type: '5-dan / u-verb', prompts: [
      { target: 'past plain',     ans: '行った',   en: 'went' },
      { target: '〜て form',       ans: '行って',   en: 'going / and then' },
      { target: 'negative plain', ans: '行かない', en: "doesn't go" },
      { target: 'past negative',  ans: '行かなかった', en: "didn't go" },
      { target: 'potential',      ans: '行ける',   en: 'can go' },
      { target: 'volitional',     ans: '行こう',   en: "let's go" }
  ]},
  { word: '読む', type: '5-dan / u-verb', prompts: [
      { target: 'polite past',    ans: '読みました', en: 'read (polite, past)' },
      { target: '〜て form',       ans: '読んで',   en: 'reading' },
      { target: 'passive',        ans: '読まれる', en: 'is read' },
      { target: 'causative',      ans: '読ませる', en: 'make read' }
  ]},
  { word: '話す', type: '5-dan / u-verb', prompts: [
      { target: '〜て form',       ans: '話して',   en: 'talking' },
      { target: 'negative plain', ans: '話さない', en: "doesn't talk" },
      { target: 'potential',      ans: '話せる',   en: 'can talk' },
      { target: 'conditional ば', ans: '話せば',   en: 'if (one) talks' }
  ]},
  // ru-verbs (Group 2)
  { word: '食べる', type: '1-dan / ru-verb', prompts: [
      { target: 'past plain',     ans: '食べた',   en: 'ate' },
      { target: '〜て form',       ans: '食べて',   en: 'eating' },
      { target: 'negative plain', ans: '食べない', en: "doesn't eat" },
      { target: 'potential',      ans: '食べられる', en: 'can eat' },
      { target: 'causative',      ans: '食べさせる', en: 'make eat' },
      { target: 'volitional',     ans: '食べよう', en: "let's eat" }
  ]},
  { word: '見る', type: '1-dan / ru-verb', prompts: [
      { target: 'polite present', ans: '見ます',   en: 'sees (polite)' },
      { target: 'past plain',     ans: '見た',     en: 'saw' },
      { target: 'passive',        ans: '見られる', en: 'is seen' },
      { target: 'imperative',     ans: '見ろ',     en: 'look! (rough)' }
  ]},
  // irregulars
  { word: '来る', type: 'irregular', prompts: [
      { target: 'past plain',     ans: '来た',     en: 'came' },
      { target: '〜て form',       ans: '来て',     en: 'coming' },
      { target: 'negative plain', ans: '来ない',   en: "doesn't come" },
      { target: 'potential',      ans: '来られる', en: 'can come' },
      { target: 'volitional',     ans: '来よう',   en: "let's come" }
  ]},
  { word: 'する', type: 'irregular', prompts: [
      { target: 'past plain',     ans: 'した',     en: 'did' },
      { target: '〜て form',       ans: 'して',     en: 'doing' },
      { target: 'negative plain', ans: 'しない',   en: "doesn't do" },
      { target: 'potential',      ans: 'できる',   en: 'can do' },
      { target: 'passive',        ans: 'される',   en: 'is done' },
      { target: 'volitional',     ans: 'しよう',   en: "let's do" }
  ]},
  // い-adj
  { word: '高い', type: 'i-adjective', prompts: [
      { target: 'past plain',     ans: '高かった', en: 'was tall/expensive' },
      { target: 'negative',       ans: '高くない', en: "isn't tall" },
      { target: 'past negative',  ans: '高くなかった', en: "wasn't tall" },
      { target: 'adverbial',      ans: '高く',     en: 'tall(ly)' }
  ]},
  { word: '楽しい', type: 'i-adjective', prompts: [
      { target: 'past plain',     ans: '楽しかった', en: 'was fun' },
      { target: 'negative',       ans: '楽しくない', en: "isn't fun" },
      { target: '〜くて (te)',     ans: '楽しくて', en: 'fun and…' }
  ]},
  // な-adj
  { word: '静か', type: 'na-adjective', prompts: [
      { target: 'attributive',    ans: '静かな',   en: 'quiet (modifying noun)' },
      { target: 'plain past',     ans: '静かだった', en: 'was quiet' },
      { target: 'negative',       ans: '静かじゃない', en: "isn't quiet" },
      { target: 'adverbial',      ans: '静かに',   en: 'quietly' }
  ]},
  { word: '便利', type: 'na-adjective', prompts: [
      { target: 'attributive',    ans: '便利な',   en: 'convenient (modifier)' },
      { target: 'negative',       ans: '便利じゃない', en: "isn't convenient" },
      { target: 'past',           ans: '便利だった', en: 'was convenient' }
  ]}
];
