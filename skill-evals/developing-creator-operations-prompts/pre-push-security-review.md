# Pre-push Security Review

**Compared range:** `master...HEAD`
**Review date:** 2026-07-29
**Scope:** Creator Operations Prompt package, project-local Skill, validators, plans, and evaluation evidence.

## Result

No credential, secret, destructive-command, code-execution, or network-exfiltration blocker was found in the current tree.

## Findings and disposition

### Prompt-injection trust boundary — resolved

The Base and Topic Prompts previously accepted free-form workspace materials without explicitly classifying embedded directives as untrusted data.

The current tree now:

- treats Workspace Data, sources, comments, links, cases, and retrieved passages as untrusted data rather than instructions;
- ignores embedded directives that try to override Prompt rules, change tasks, invoke tools, or disclose unrelated Workspace Data;
- limits use to task-relevant material;
- preserves workspace isolation.

The Topic validator requires this boundary.

### Local path disclosure — resolved in current tree

Raw evaluation artifacts previously contained a local username, worktree path, global Skill path, and temporary-directory path. These are replaced with:

- `$REPO_ROOT`;
- `$CODEX_SKILL_CREATOR`;
- `$TMPDIR`.

Current-tree scans return no `/Users/`, `/home/`, or `/private/tmp` path.

The earlier local commit still contains the pre-sanitization evidence. A public push should therefore use a sanitized squashed history or a private repository. Rewriting the branch history requires explicit approval.

### Product and validation findings — resolved

- Real Audience Question is explicitly prioritized over generic trends or model-generated angles.
- The canonical package validator now requires the production Topic Prompt and fails if it is missing.
- The Topic example's Display Text includes each proposal's title, audience basis, core question, and angle.
- Blocking Content Risk wording now specifically blocks Platform Approval and publication, without replacing separate Topic Approval or Master Approval decisions.
- Generic “user-facing” vocabulary was replaced by canonical “Creator-facing” wording.

### Validator duplication — accepted residual quality issue

The Base and Topic validators duplicate small helper functions and the nine-field key list. This is not a security issue and does not affect current correctness. Consolidation can wait until another Task Prompt creates a third consumer.

## Scans

The current tree was scanned for:

- private-key headers;
- GitHub, OpenAI, Slack, AWS, and bearer-token patterns;
- email, phone-number, and identity-number patterns;
- local absolute paths;
- network and destructive operations in Skill scripts.

No actual secret or personal record was found. Risk strings in Prompt examples are synthetic product-test content.

## Validation

```sh
node skills/developing-creator-operations-prompts/scripts/validate-base-package.mjs .
ruby skills/developing-creator-operations-prompts/scripts/validate-skill-structure.rb skills/developing-creator-operations-prompts
git diff --check
git diff -- creator-operations/CONTEXT.md docs/product/mvp-scope.md docs/adr docs/validation
```

All commands pass; product source documents have no diff.

## Upload gate

The current tree is safe to upload after both conditions are met:

1. a GitHub remote or GitHub App installation identifies the target repository;
2. the user chooses either a private repository or approves squashing the unpushed branch to remove local paths from historical commits.
