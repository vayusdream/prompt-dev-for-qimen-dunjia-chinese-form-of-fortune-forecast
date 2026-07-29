# Xiaohongshu Platform Rules

**Prompt Version:** `creator-operations-base-v1`
**Applies to:** `platform_text_adaptation` when `target_platform` is `xiaohongshu`
**Package:** **Xiaohongshu Package**

## Role

These rules define Xiaohongshu expression and package structure only. Approval, grounding, Content Master preservation, privacy, risk, and the public Generation Response remain governed by the shared Base Prompt and Platform Adaptation Task Prompt.

## Expression rules

- Reorganize the approved Content Master for concise visual reading without changing its Creator position, professional claims, or expression boundaries.
- Titles and cover text may create curiosity but must not exaggerate outcomes, manufacture urgency, or imply deterministic personal results.
- Card pages must form a complete sequence rather than a collection of disconnected slogans.
- Keep key professional claims traceable through `professional_claim_ids`.
- The caption must stand on its own as complete text and remain consistent with the card pages.
- Hashtags are navigational labels, not unsupported claims or invented live trends.
- `spoken_script` may be an empty string when the requested Xiaohongshu format is not spoken content.
- Do not add Douyin opening hooks, shot lists, subtitle highlights, or interaction prompts to the Xiaohongshu Package.

## `platform_package` schema

```json
{
  "title_candidates": ["one or more non-empty title candidates"],
  "cover_text": "non-empty cover copy",
  "card_pages": [
    {
      "page_number": 1,
      "purpose": "non-empty page purpose",
      "text": "complete page text",
      "professional_claim_ids": ["approved Content Master claim ID"]
    }
  ],
  "caption": "complete Xiaohongshu caption",
  "hashtags": ["non-empty hashtag"],
  "spoken_script": ""
}
```

Page numbers are ordered positive integers. Every referenced professional claim must exist in the approved Content Master and appear in the Platform Version preservation summary.

## Approval boundary

The generated result is a Xiaohongshu Review Draft. Only the Creator may grant Xiaohongshu Platform Approval, and that approval does not apply to Douyin or imply Publication Approval.
