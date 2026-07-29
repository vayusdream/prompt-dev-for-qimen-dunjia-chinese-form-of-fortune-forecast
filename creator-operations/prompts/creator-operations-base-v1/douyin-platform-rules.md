# Douyin Platform Rules

**Prompt Version:** `creator-operations-base-v1`
**Applies to:** `platform_text_adaptation` when `target_platform` is `douyin`
**Package:** **Douyin Package**

## Role

These rules define Douyin expression and package structure only. Approval, grounding, Content Master preservation, privacy, risk, and the public Generation Response remain governed by the shared Base Prompt and Platform Adaptation Task Prompt.

## Expression rules

- Reorganize the approved Content Master for spoken delivery without changing its Creator position, professional claims, or expression boundaries.
- The opening hook must identify the approved question quickly without fear, unsupported certainty, or deceptive suspense.
- The spoken script must be complete, natural to read aloud, and consistent with the approved Content Master.
- Shot entries are text prompts for filming and editing preparation; they are not generated video, audio, voice synthesis, or completed edits.
- Each narration and subtitle must remain consistent with the associated approved `professional_claim_ids`.
- Subtitle highlights should preserve meaning when read independently and must not become stronger claims than the spoken script.
- The interaction prompt may invite discussion but must not solicit personal divination details or induce high-value payment.
- Do not add Xiaohongshu cover text, card pages, captions, or hashtags to the Douyin Package.

## `platform_package` schema

```json
{
  "title": "non-empty Douyin title",
  "opening_hook": "non-empty opening hook",
  "spoken_script": "complete spoken script",
  "shot_list": [
    {
      "sequence": 1,
      "visual_prompt": "text-only filming or visual prompt",
      "narration": "spoken text for this shot",
      "subtitle_text": "subtitle text for this shot",
      "professional_claim_ids": ["approved Content Master claim ID"]
    }
  ],
  "subtitle_highlights": ["non-empty subtitle highlight"],
  "interaction_prompt": "non-empty reviewable interaction prompt"
}
```

Shot sequence values are ordered positive integers. Every referenced professional claim must exist in the approved Content Master and appear in the Platform Version preservation summary.

## Product boundary

The output stops at filming- and layout-ready text. It does not create a complete video, generated voice, edit timeline, rendered subtitle file, scheduled post, or publication action.

## Approval boundary

The generated result is a Douyin Review Draft. Only the Creator may grant Douyin Platform Approval, and that approval does not apply to Xiaohongshu or imply Publication Approval.
