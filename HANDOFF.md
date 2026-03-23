# HANDOFF

## Session summary

This session reworked Parla’s content system toward family-first authoring, stronger request-cluster coverage, and optional higher-quality cloze prompts.

## What changed

1. **Dataset quality pass**
   - Reviewed the starter dataset and removed weak clozes that only tested random nouns, places, or other low-value vocabulary targets.
   - Improved surviving clozes so they point more directly at phrase structure or meaningful usage slots.

2. **Family-first content expansion**
   - Added six new request cards so the request family now has a tighter comparison set across patterns like `Could you...?`, `Would you mind ...ing?`, `I was wondering if...`, `Would you be able to...?`, `If possible, could you...?`, and permission requests.
   - Applied `family`, `slots`, `quick_variations`, `practice_note`, and `ai_transfer_prompt` more consistently across the older situational cards.
   - Reclassified opinion/disagreement and clarification-related cards so those clusters are easier to expand later.

3. **Drill rendering update**
   - Drill view now keeps intent and situation clearly primary.
   - Cloze is visually de-emphasized and labeled as optional when present.
   - Family is surfaced in the drill and browse list to make clusters more visible without redesigning the app.

4. **Docs refresh**
   - README now describes family-first expansion, optional cloze behavior, and the larger request cluster.
   - The dataset playbook now documents family-first authoring and explicit cloze quality rules.

## Validation run

- `npm run lint`
- `npm run build`

## Suggested next steps

1. Expand the clarification family with 2–4 more contrastive cards such as `Do you mean...?`, `So you’re saying...?`, and `Let me make sure I understand.`
2. Add light browse-level family filtering once the next one or two families are expanded enough to justify a dedicated control.
3. Continue reviewing older core cards and consider whether some very open slot cards should move toward family-based mini-sets with stronger contrasts.
