# Creator Operations Interactive Prototype Design

## Purpose

Build a throwaway, clickable Web prototype that answers one question:

> Does the Creator Operations Tool workflow feel clear and efficient on both desktop and mobile?

The prototype validates information architecture, step progression, editing flow, approval gates, adoption feedback, and responsive behavior. It does not validate model quality, persistence, authentication, document parsing, platform APIs, or production architecture.

## Reference Direction

The visual and interaction direction takes cues from the public FateTell website without copying its brand, content, logo, or proprietary assets.

Adopt:

- warm ivory and near-white surfaces;
- deep charcoal text and primary controls;
- Chinese serif display headings with clean sans-serif body text;
- generous editorial whitespace;
- sparse top navigation on desktop;
- immersive long-form task pages;
- black pill-shaped primary actions;
- restrained amber and violet glow accents;
- soft rounded content cards and fine neutral borders.

Avoid:

- a dark, heavy SaaS sidebar;
- dense dashboard grids;
- green as the dominant brand color;
- decorative metaphysical symbols that distract from work;
- fake claims that the prototype is connected to a real model or platform.

## Prototype Shape

Use a single responsive application with in-memory state and realistic Qimen Dunjia creator content.

Desktop:

- slim top navigation for Home, Topics, Create, Review, Knowledge, and Data;
- wide centered content stage;
- a primary editorial work card;
- a smaller contextual review or progress panel;
- no permanent left sidebar.

Mobile:

- compact top bar showing brand, current step, and overflow action;
- one task per screen;
- scrollable long-form content;
- sticky pill-shaped primary action above bottom navigation;
- bottom navigation for Home, Topics, Create, Review, and More;
- Knowledge and Data remain reachable through More while preserving full feature parity.

## Clickable Journey

The prototype must provide one coherent end-to-end journey:

1. Home shows pending work and a primary “Start topic discovery” action.
2. Topic discovery accepts a free-form Prompt and optional structured constraints.
3. Generate displays a short simulated progress state and then five Generated Topic Proposal cards.
4. The user selects one proposal, rejects another, and confirms Topic Approval.
5. The Topic Library shows the approved item and its current status.
6. Create opens a structured Content Master with realistic editable blocks.
7. An independent review panel shows one expression-boundary prompt.
8. Master Approval unlocks separate Xiaohongshu and Douyin generation actions.
9. Xiaohongshu lets the user choose Note or Video Script; Douyin offers 30, 60, or default 90 seconds.
10. A generated platform version appears in structured blocks.
11. The user edits one block and can try Block Regeneration.
12. Platform Approval enables copy and Markdown-export simulations.
13. An Adoption Prompt asks for direct, edited, partial, or rejected adoption.
14. Data reflects the selected Adoption Decision and sample progress.

## Supporting Screens

Home:

- initialization readiness;
- pending topic, master, review, knowledge, and snapshot tasks;
- recent work;
- a single dominant next action.

Topics:

- Prompt input;
- five proposal cards;
- Topic Library with candidate, approved, in-progress, deferred, rejected, and published examples;
- one Similar Topic Match example.

Create:

- Content Master blocks;
- platform-choice cards;
- Xiaohongshu Note and Video Script preview;
- Douyin duration selector;
- generated platform blocks;
- independent review panel.

Review:

- Adoption Backlog;
- before-and-after block comparison;
- Adoption Reason selection;
- one Learning Suggestion example.

Knowledge:

- three source-authority groups;
- one proposed entry;
- one confirmed entry;
- Creator Voice Profile;
- preparation state.

Data:

- Text Output Adoption Rate;
- Effective Text Adoption Rate;
- Direct Adoption Rate;
- Topic Proposal Selection Rate;
- sample progress for the three Core Generation Tasks;
- content-shape breakdown;
- no fake live platform integration.

## Interaction Rules

- State lives only in browser memory and resets when the prototype is reloaded.
- Simulated generation must be visibly labeled as a prototype interaction.
- Generated Original remains visible in a comparison view after edits.
- The user cannot open platform generation before Master Approval.
- Xiaohongshu and Douyin are triggered and approved independently.
- Block Regeneration proposes replacement text and requires explicit acceptance.
- Export and copy interactions show confirmation but do not create files or claim publication.
- Adoption feedback updates the Data screen immediately.
- All primary controls have keyboard focus styles and touch targets of at least 44px.

## Content Tone

Use realistic but cautious Chinese content:

- educational framing;
- no AI-independent Qimen interpretation;
- no medical, financial, legal, death, pregnancy, or deterministic claims;
- no “guaranteed accuracy” or transformation promises;
- no copied FateTell marketing language.

Example topic:

> 为什么越背盘，越学不懂奇门？

Example core position:

> 真正的入门，不是先记住更多符号，而是理解时间、空间与人的关系如何被组织。

## Error and Empty States

Prototype only:

- one simulated generation retry state;
- one empty Topic Library state before approval;
- one blocked platform action before Master Approval;
- one pending Adoption Decision;
- one knowledge-preparation warning.

Do not create exhaustive production errors.

## Validation

Desktop validation:

- 1440 × 900 viewport;
- top navigation remains readable;
- content stage does not become excessively wide;
- review panel stays visible without crowding the editor.

Mobile validation:

- 390 × 844 viewport;
- no horizontal overflow;
- sticky primary action does not cover content;
- bottom navigation remains reachable;
- structured blocks are readable and editable;
- all workflow actions remain available.

Browser journey:

- complete the flow from Home to Data on both viewport sizes;
- verify approval gates;
- verify independent platform actions;
- verify adoption feedback changes displayed metrics;
- verify reload resets prototype state.

## Prototype Disposal

The prototype is explicitly throwaway. After the workflow is validated:

- record accepted interaction decisions in the product documentation;
- delete the prototype or replace it with production implementation;
- do not evolve its in-memory state or fake service layer into production code.
