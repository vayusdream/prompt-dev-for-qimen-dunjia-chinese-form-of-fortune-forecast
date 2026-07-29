# Creator Operations Interactive Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a throwaway responsive prototype that validates the Creator Operations workflow on desktop and mobile.

**Architecture:** Use one client-side React application with in-memory state and route-like screen switching. Keep the fake domain state, screen components, and visual system separate so the prototype can demonstrate approval gates and metric changes without a backend.

**Tech Stack:** Sites starter, React, TypeScript, CSS, Lucide icons, browser-based interaction validation

## Global Constraints

- Follow `docs/superpowers/specs/2026-07-29-creator-operations-interactive-prototype-design.md`.
- Mark the experience as an interactive prototype.
- Use realistic but cautious Chinese Qimen Dunjia creator content.
- Do not connect authentication, persistence, real models, uploads, exports, or social platforms.
- Use warm ivory surfaces, charcoal controls, Chinese serif headings, generous whitespace, amber/violet accents, and pill-shaped primary actions.
- Keep all primary controls at least 44px high and keyboard focus visible.
- Validate at 1440 × 900 and 390 × 844.
- Keep prototype state in memory and reset it on reload.

---

### Task 1: Create the prototype shell and responsive visual system

**Files:**
- Create: `.openai/hosting.json`
- Create: `package.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `app/prototype/types.ts`
- Create: `app/prototype/mock-data.ts`
- Create: `app/prototype/PrototypeShell.tsx`

**Interfaces:**
- Produces: `PrototypeScreen`, `PrototypeState`, `PrototypeAction`, `PrototypeShell`.
- Consumes: no application code; project documentation is reference-only.

- [ ] **Step 1: Initialize the Sites project**

Run the Sites initializer once at the repository root and preserve its package manager, build scripts, and hosting metadata.

Expected: the starter renders and `.openai/hosting.json` exists.

- [ ] **Step 2: Define the prototype state**

```ts
export type PrototypeScreen =
  | "home"
  | "topics"
  | "topic-proposals"
  | "topic-library"
  | "master"
  | "platform-choice"
  | "platform-editor"
  | "review"
  | "knowledge"
  | "data";

export type PrototypeState = {
  screen: PrototypeScreen;
  selectedTopicId?: string;
  topicApproved: boolean;
  masterApproved: boolean;
  platform: "xiaohongshu" | "douyin" | null;
  contentShape: "note" | "video" | null;
  douyinDuration: 30 | 60 | 90;
  blockProposalOpen: boolean;
  platformApproved: boolean;
  adoption: "direct" | "edited" | "partial" | "rejected" | null;
};
```

- [ ] **Step 3: Add realistic mock content**

Include five topic proposals, one similar-topic warning, one approved topic, Content Master blocks, Xiaohongshu and Douyin blocks, one expression-boundary prompt, one Learning Suggestion, knowledge entries, and baseline metric values.

- [ ] **Step 4: Build the shell**

Desktop uses a slim top navigation and centered content stage. Mobile uses a compact top bar, sticky primary action, and bottom navigation. Add a visible “交互原型” label.

- [ ] **Step 5: Verify the shell build**

Run: `npm run build`

Expected: build exits 0 and no starter loading skeleton remains.

- [ ] **Step 6: Commit**

```bash
git add .openai package.json package-lock.json app
git commit -m "feat: scaffold creator operations prototype"
```

### Task 2: Implement topic discovery and approval

**Files:**
- Create: `app/prototype/screens/HomeScreen.tsx`
- Create: `app/prototype/screens/TopicPromptScreen.tsx`
- Create: `app/prototype/screens/TopicProposalsScreen.tsx`
- Create: `app/prototype/screens/TopicLibraryScreen.tsx`
- Create: `app/prototype/components/TopicProposalCard.tsx`
- Modify: `app/prototype/PrototypeShell.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `PrototypeState`, mock topic proposals.
- Produces: Home-to-Topic-Library journey and Topic Approval state.

- [ ] **Step 1: Implement Home**

Show initialization readiness, five pending-work categories, recent work, and one dominant “开始选题” action.

- [ ] **Step 2: Implement Prompt input**

Provide a free-form textarea prefilled with a realistic topic request plus optional audience, platform, and purpose controls. “生成候选” shows a short simulated progress transition.

- [ ] **Step 3: Implement five proposal cards**

Allow selecting one proposal, rejecting one, viewing a Similar Topic Match, and confirming Topic Approval. Disable confirmation until one proposal is selected.

- [ ] **Step 4: Implement Topic Library**

Show the newly approved topic plus examples of in-progress, deferred, rejected, and published statuses. Provide “展开内容母版”.

- [ ] **Step 5: Verify topic flow**

Manually complete Home → Prompt → five proposals → approval → Topic Library at desktop and mobile widths.

Expected: no action is hidden, selected and rejected states are clear, and the approved topic persists until reload.

- [ ] **Step 6: Commit**

```bash
git add app/prototype app/globals.css
git commit -m "feat: prototype topic discovery workflow"
```

### Task 3: Implement Content Master, platform adaptation, and review

**Files:**
- Create: `app/prototype/screens/ContentMasterScreen.tsx`
- Create: `app/prototype/screens/PlatformChoiceScreen.tsx`
- Create: `app/prototype/screens/PlatformEditorScreen.tsx`
- Create: `app/prototype/screens/ReviewScreen.tsx`
- Create: `app/prototype/components/EditableBlock.tsx`
- Create: `app/prototype/components/ReviewPanel.tsx`
- Create: `app/prototype/components/AdoptionPrompt.tsx`
- Modify: `app/prototype/PrototypeShell.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: approved topic and platform mock content.
- Produces: Master Approval, independent platform selection, Block Regeneration, Platform Approval, and Adoption Decision.

- [ ] **Step 1: Build Content Master**

Render the agreed structured fields without Knowledge Trace, Unverified Claim, Knowledge Conflict, or Blocking Content Risk as editable fields. Show one expression-boundary item in an independent review panel.

- [ ] **Step 2: Enforce Master Approval**

Keep platform actions locked until “确认母版” is clicked. After approval, show independent Xiaohongshu and Douyin choices.

- [ ] **Step 3: Build platform choices**

Xiaohongshu offers Note and Video Script. Douyin offers 30, 60, and default 90 seconds. Store the choice in memory.

- [ ] **Step 4: Build structured platform editor**

Show Generated Original and editable blocks. Block Regeneration opens a proposed replacement with explicit accept and reject actions.

- [ ] **Step 5: Build approval and adoption feedback**

Platform Approval enables simulated copy and Markdown export confirmations, then opens the Adoption Prompt. Save the selected state.

- [ ] **Step 6: Verify gates**

Expected: platform generation cannot open before Master Approval; block text changes only after acceptance; Xiaohongshu and Douyin remain independent; adoption persists until reload.

- [ ] **Step 7: Commit**

```bash
git add app/prototype app/globals.css
git commit -m "feat: prototype creation and review workflow"
```

### Task 4: Add Knowledge, Data, responsive validation, and deployment

**Files:**
- Create: `app/prototype/screens/KnowledgeScreen.tsx`
- Create: `app/prototype/screens/DataScreen.tsx`
- Create: `app/prototype/components/MetricCard.tsx`
- Modify: `app/prototype/PrototypeShell.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: prototype adoption state and mock knowledge.
- Produces: supporting pages, responsive completion, and deployable prototype.

- [ ] **Step 1: Build Knowledge**

Show Authority Rules, Reference Materials, Historical Expressions, one Proposed Knowledge Entry, one Confirmed Knowledge Entry, Creator Voice Profile, and preparation state.

- [ ] **Step 2: Build Data**

Show the three adoption rates, Topic Proposal Selection Rate, three core-task sample progress bars, and content-shape breakdown. Adoption feedback from Task 3 must visibly update at least one metric.

- [ ] **Step 3: Finish responsive behavior**

At 1440 × 900, preserve editorial whitespace and a visible review panel. At 390 × 844, remove horizontal overflow, keep sticky actions above bottom navigation, and preserve all functions through the More menu.

- [ ] **Step 4: Add metadata and prototype disclaimer**

Use site-specific title and description. Do not claim model, platform, or persistence connectivity.

- [ ] **Step 5: Validate build and interaction**

Run: `npm run build`

Expected: build exits 0.

Use browser interaction to complete Home → Data at both required viewports and verify reload resets state.

- [ ] **Step 6: Deploy with Sites**

Push the exact validated source, save one version, deploy privately when available, and wait for successful deployment.

- [ ] **Step 7: Commit**

```bash
git add app .openai package.json package-lock.json
git commit -m "feat: complete responsive creator operations prototype"
```

## Self-Review

- The plan covers every clickable step in the approved prototype specification.
- Production authentication, persistence, model calls, uploads, exports, and platform connections remain absent.
- Types are shared from one file and reused across screens.
- Desktop and mobile validation use the two approved viewport sizes.
- No step asks the prototype to become production code.

## Execution Handoff

Execute inline in this session because the user asked to start development and did not request subagent delegation.
