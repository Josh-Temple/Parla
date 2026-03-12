# Parla Dataset Prompt Playbook (JA)

このドキュメントは、Parla 向けの英語フレーズカードを AI で生成・整形するときの実務テンプレート集です。

## 1) 初期50カード生成用プロンプト

```text
You are creating the initial phrase-card dataset for an English output training app called Parla.

App concept:
Parla is a high-tempo English expression trainer.
It is not a chatbot.
Its main loop is:
- see a Japanese meaning or short scenario
- mentally recall the English phrase
- reveal the answer
- self-rate
- move on quickly

Your task:
Generate high-quality English phrase cards for the initial MVP dataset.

Content goals:
- practical, modern English
- useful for daily conversation and work communication
- focused on English output expression
- especially useful for Japanese learners who want to speak and write more naturally
- short, memorable, reusable expressions
- avoid unnatural textbook phrasing
- avoid slang-heavy or niche expressions
- avoid obsolete or overly formal phrases unless genuinely useful

Target categories and counts:
- Requests: 14
- Refusals / Limits: 12
- Opinions: 14
- Softeners / Cushioning: 10

Target functions:
- request
- refusal
- opinion
- softening

Allowed register values:
- casual
- neutral
- polite
- formal

Difficulty scale:
- 1 = very common and easy
- 2 = common and useful, slightly more nuanced
- 3 = somewhat advanced but still practical

Important design principles:
1. Each card should teach one distinct phrase or pattern.
2. Phrases must be genuinely reusable.
3. Similar phrases are welcome, but avoid near-duplicates unless the contrast is meaningful.
4. Contrast notes should be short and practical.
5. Notes should be concise and learner-friendly.
6. Scenario prompts should be concrete and easy to imagine.
7. The output should support fast self-study without typing.

Required JSON shape for each card:
{
  "id": "string",
  "phrase": "string",
  "japanese_meaning": "string",
  "function": "request | refusal | opinion | softening",
  "register": "casual | neutral | polite | formal",
  "pattern": "string",
  "example": "string",
  "notes": "string",
  "tags": ["string", "string"],
  "similar": ["string", "string"],
  "contrast": "string",
  "prompts": {
    "meaning": "string",
    "scenario": "string",
    "cloze": "string"
  },
  "difficulty": 1
}

ID rules:
- use lowercase snake-like IDs
- format: {function}_{3-digit number}
- examples:
  - request_001
  - refusal_004
  - opinion_011
  - softening_008

Content rules:
- "phrase" should be the target phrase or pattern learners should recall
- "pattern" should show the reusable structure
- "example" should be natural and concise
- "japanese_meaning" should be practical Japanese, not overly literal
- "similar" should usually contain 2 items
- "tags" should be short and practical, e.g. ["work", "meeting"] or ["daily", "request"]
- "prompts.meaning" should be a short Japanese cue
- "prompts.scenario" should describe a realistic situation in Japanese
- "prompts.cloze" should be an English cloze prompt based on the phrase or example

Quality constraints:
- avoid duplicated cards
- avoid cards that are too close in meaning unless contrast is important
- avoid overly long examples
- avoid idioms unless highly useful
- avoid culture-specific expressions that need heavy explanation
- prefer expressions that can be reused in many contexts

Output requirements:
- return valid JSON only
- output a single object with:
{
  "schema_version": 1,
  "cards": [...]
}
- include exactly 50 cards
- maintain the exact category counts requested
- do not include markdown
- do not include commentary outside JSON
```

## 2) 品質改善・整形用プロンプト

```text
You are reviewing and improving a JSON phrase-card dataset for the English expression training app Parla.

Your task:
Clean, normalize, and improve the dataset while preserving the intended schema and learning design.

Goals:
- remove duplication
- improve naturalness
- improve contrast clarity
- improve Japanese cue quality
- improve example sentence quality
- keep cards short, practical, and reusable
- preserve fast-study suitability

Review checklist:
1. Remove or rewrite awkward English.
2. Remove or rewrite unnatural Japanese.
3. Ensure each card teaches one clear phrase or pattern.
4. Ensure "similar" items are actually relevant.
5. Ensure "contrast" is concise and useful.
6. Ensure "example" is natural and not too long.
7. Ensure "prompts.meaning" is a short and memorable Japanese cue.
8. Ensure "prompts.scenario" is concrete and realistic.
9. Ensure "prompts.cloze" is valid and readable.
10. Ensure category balance is preserved.
11. Ensure IDs remain unchanged unless there is a critical schema issue.
12. Remove near-duplicates unless their contrast is educationally meaningful.

Important:
- keep the same JSON schema
- preserve exactly 50 cards unless there is a critical issue
- do not add explanations outside JSON
- return valid JSON only

Return format:
{
  "schema_version": 1,
  "cards": [...]
}
```

## 3) 類似表現の差分を強める追加プロンプト

```text
For each card, strengthen the contrast with its similar phrases.

Rules:
- keep "contrast" to one short sentence
- focus on directness, politeness, softness, or typical usage context
- avoid dictionary-style explanations
- make the contrast useful for fast learner decisions
- do not make claims that are too absolute
- keep wording simple

Examples of good contrast style:
- "Can you...? より少し丁寧。"
- "より遠回しでやわらかい依頼。"
- "直接否定せず、留保を置く言い方。"
- "単なる断りより代案を出す感じが強い。"

Return valid JSON only.
```

## 4) 音声用フィールドを後から足すためのプロンプト

```text
Add optional audio metadata to each card in the following shape:

"audio": {
  "phraseUrl": "/audio/{id}_phrase.mp3",
  "exampleUrl": "/audio/{id}_example.mp3",
  "voice": "en-US-female-01"
}

Rules:
- use the card id to build the file names
- do not change any other field
- return valid JSON only
```

## 5) カテゴリごとに小分けで作る場合のプロンプト

一発50件より、カテゴリごとに作る方が品質を確認しやすい。

### Requests 14件

```text
Generate 14 JSON phrase cards for the category "Requests" for the app Parla.

Requirements:
- function must be "request"
- include a mix of neutral, polite, and formal-friendly request patterns
- prioritize highly reusable expressions
- include practical contrasts such as:
  - Can you...?
  - Could you...?
  - Would you...?
  - Would you mind ...ing?
  - Would it be possible to...?
  - I was wondering if...
  - Would you be able to...?
  - I’d appreciate it if...
- avoid redundant near-duplicates unless the contrast is clearly useful
- output valid JSON only in the standard Parla schema
- IDs must run from request_001 to request_014
```

### Refusals / Limits 12件

```text
Generate 12 JSON phrase cards for the category "Refusals / Limits" for the app Parla.

Requirements:
- function must be "refusal"
- focus on soft refusals, limits, non-availability, and alternative suggestions
- prioritize practical expressions for daily and work contexts
- include patterns like:
  - I’m afraid I can’t...
  - I may not be able to...
  - I won’t be able to...
  - That might be difficult.
  - I’m not sure I can...
  - Would it work if... instead?
  - Could we do ... instead?
- avoid harsh or blunt refusal styles unless contrast is educationally useful
- output valid JSON only in the standard Parla schema
- IDs must run from refusal_001 to refusal_012
```

### Opinions 14件

```text
Generate 14 JSON phrase cards for the category "Opinions" for the app Parla.

Requirements:
- function must be "opinion"
- focus on stating opinions, soft disagreement, partial agreement, and confidence control
- prioritize expressions useful in discussion, meetings, and daily communication
- include patterns like:
  - I think...
  - I feel like...
  - It seems to me that...
  - I’m not sure that...
  - I’m not convinced that...
  - I see your point, but...
  - You may be right, but...
  - I partly agree, but...
  - It might be better to...
- avoid abstract academic phrasing unless highly practical
- output valid JSON only in the standard Parla schema
- IDs must run from opinion_001 to opinion_014
```

### Softeners / Cushioning 10件

```text
Generate 10 JSON phrase cards for the category "Softeners / Cushioning" for the app Parla.

Requirements:
- function must be "softening"
- focus on hedging, cushioning, reducing directness, and softening judgments
- prioritize expressions that combine well with other phrases
- include items like:
  - perhaps
  - maybe
  - a bit
  - a little
  - somewhat
  - kind of
  - It might be...
  - It seems...
  - I’m not sure if...
- avoid overly subtle distinctions unless they are useful in real communication
- output valid JSON only in the standard Parla schema
- IDs must run from softening_001 to softening_010
```

## 6) 生成後の人間チェック観点

優先順:

- 高優先: 本当に使いたい表現 / 不自然さ / 重複 / contrast の有用性
- 中優先: 日本語の自然さ / 例文の長さ / scenario の明快さ
- 低優先: tags の細かさ / difficulty の微調整

## 7) 実務的なおすすめ手順

1. カテゴリごとに生成
2. 各カテゴリを整形
3. 全体を結合
4. 重複チェック
5. contrast だけ追加改善
6. audio フィールド付与
7. `cards.json` 化

## 8) かなり短い最小版プロンプト

```text
Create JSON phrase cards for Parla, a fast English phrase-recall training app.

Requirements:
- practical, modern English
- useful for Japanese learners
- categories: Requests, Refusals / Limits, Opinions, Softeners / Cushioning
- short reusable phrases
- concise natural examples
- short practical Japanese meanings
- clear contrast with similar phrases
- valid JSON only
- schema:
  id, phrase, japanese_meaning, function, register, pattern, example, notes, tags, similar, contrast, prompts { meaning, scenario, cloze }, difficulty

Now generate [N] cards for the category [CATEGORY].
```
