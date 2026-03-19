# Parla Dataset Prompt Playbook (JA)

このドキュメントは、Parla 向けの英語カードを AI で生成・整形するときの実務テンプレート集です。

## 現在の方針

Parla は「役立つフレーズ集アプリ」を維持しつつ、今後のデータ追加では **核文型を覚えて変形し、あとで AI 会話練習に持ち込みやすいこと** を優先します。

重要:

- Parla 自体はチャットボット化しない
- メインループは `see prompt → think → reveal → self-rate → next` のまま維持する
- まずは大量追加よりも、短く・高頻度で・変形しやすいカードを増やす
- situational phrase は残すが、今後は foundation layer を先に厚くする

推奨する foundation family:

1. Self / identity / background
2. Intent / need / plan
3. Daily actions / time
4. Opinions / uncertainty / comparison
5. Repair / survival expressions
6. Questions to continue conversation

推奨タグ:

- `core`
- `survival`
- `question`
- `daily`
- `opinion`
- `identity`
- `intent`

## 1) Foundation starter 生成用プロンプト

```text
You are creating new card content for Parla.

Product direction:
- Do not rebuild the app.
- Keep the current mobile-first, local-first flash-drill architecture.
- Parla is not a chatbot.
- Parla should help learners memorize a small set of high-frequency sentence patterns,
  see how those patterns can vary,
  and use them later in AI conversation practice outside the app.

Your task:
Generate high-quality starter cards centered on reusable core English patterns.

Content priorities:
- short, modern, highly reusable English
- patterns learners can vary by swapping slots
- early speaking / output friendly
- strong in english-first mode
- still understandable in english-only mode
- avoid stiff textbook phrasing
- avoid niche business English as the default focus
- avoid slang-heavy content

Target families:
1. Self / identity / background
2. Intent / need / plan
3. Daily actions / time
4. Opinions / uncertainty / comparison
5. Repair / survival expressions
6. Questions to continue conversation

Volume target:
- generate around 20–30 cards per batch unless instructed otherwise
- prioritize quality and learnability over volume

Required JSON envelope:
{
  "schema_version": 1,
  "cards": []
}

Base required card fields:
{
  "id": "string",
  "category": "string",
  "phrase": "string",
  "function": "string",
  "register": "casual | neutral | polite | formal",
  "pattern": "string",
  "example": "string",
  "notes": "string",
  "tags": ["string"],
  "similar": ["string"],
  "contrast": "string",
  "prompts": {
    "intent": "string",
    "situation": "string",
    "cloze": "string"
  },
  "support": {
    "jaHint": "string"
  },
  "difficulty": 1,
  "status": {
    "published": true
  }
}

Optional fields recommended for core-pattern cards:
{
  "family": "string",
  "slots": ["string"],
  "quick_variations": ["string", "string"],
  "practice_note": "string",
  "ai_transfer_prompt": "string"
}

Authoring rules:
- keep old cards valid; optional fields only
- prefer short examples
- prompts should be concrete and easy to imagine
- Japanese support should stay lightweight and optional
- `pattern` must make the reusable structure obvious
- `quick_variations` should usually be 2–4 short natural variations
- `practice_note` should explain how to swap or extend the pattern in one line
- `ai_transfer_prompt` should be one short idea for later practice outside the main drill
- tag foundation cards with `core`

Output requirements:
- return valid JSON only
- no markdown
- no commentary outside JSON
```

## 2) 品質改善・整形用プロンプト

```text
You are reviewing and improving a JSON card dataset for Parla.

Goals:
- strengthen the foundation layer first
- improve naturalness
- improve pattern reusability
- improve variation quality
- keep cards short and memorable
- preserve backward compatibility with the current schema

Review checklist:
1. Remove awkward English.
2. Remove awkward Japanese.
3. Ensure each card teaches one clear reusable phrase or pattern.
4. Ensure `pattern` is more general than the target phrase when possible.
5. Ensure `quick_variations` are short, natural, and not redundant.
6. Ensure `practice_note` is one line and actually helps variation.
7. Ensure `contrast` is concise and practical.
8. Ensure `example` is short and natural.
9. Ensure prompts are concrete and useful for fast recall.
10. Prefer high-frequency conversation English over niche professional language.
11. Keep old IDs unless there is a critical issue.
12. Remove near-duplicates unless the contrast is educationally meaningful.

Output valid JSON only.
```

## 3) 類似表現の差分を強める追加プロンプト

```text
For each card, strengthen the contrast with its similar phrases.

Rules:
- keep `contrast` to one short sentence
- focus on directness, politeness, softness, certainty, or usage context
- avoid dictionary-style explanations
- make the contrast useful for fast learner decisions
- keep wording simple
- when possible, help the learner know when to swap patterns

Return valid JSON only.
```

## 4) variation 補強用プロンプト

```text
Add or improve the following optional fields for each core-pattern card:
- `family`
- `slots`
- `quick_variations`
- `practice_note`
- `ai_transfer_prompt`

Rules:
- do not remove existing required fields
- keep optional fields short and practical
- `quick_variations` should be 2 to 4 items
- variations should sound natural in spoken English
- `ai_transfer_prompt` must not imply an in-app chatbot feature
- return valid JSON only
```

## 5) 小分け生成のおすすめ

一発で巨大データを作るより、family ごとに小分けで作る方が品質確認しやすいです。

おすすめ順:

1. identity
2. intent
3. daily
4. opinion / uncertainty
5. survival / repair
6. follow-up questions

特に最初の 20〜30 枚は、以下のような核文型を優先してください。

- I am from ...
- I live in ...
- I work in ...
- I study ...
- I like ...
- I am interested in ...
- I want to ...
- I need ...
- I am trying to ...
- I am going to ...
- I usually ...
- I often ...
- I think ...
- I do not think ...
- I am not sure ...
- It depends ...
- I do not understand.
- Could you say that again?
- Where are you from?
- What do you mean by ...?
