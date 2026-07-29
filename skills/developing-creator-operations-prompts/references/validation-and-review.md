# Prompt Package Validation and Review

## Evidence gate

Do not say complete, ready, fixed, valid, or passed until fresh commands exit successfully and their output has been read.

Record:

- the working directory used for execution;
- exact, copy-pasteable command block without ellipses or paraphrase;
- exit code;
- actual output;
- commit or compared version.

Keep raw terminal evidence in the active session. In a version-controlled report, do not publish a machine-specific username, home directory, temporary path, credential, or token merely to make the evidence literal. Replace only that sensitive path or secret with an explicit marker such as `[machine-specific path redacted]`, state that sanitization occurred, and preserve the command, exit code, and all semantically relevant output unchanged. Identify the working directory as the repository root or worktree root and include a copy-pasteable command such as `git rev-parse --show-toplevel` when the local absolute value is intentionally omitted.

Every recorded check must run without `|| true`, ignored exit codes, or another construct that can convert failure into success. If a command errors, record it as failed, correct it, and rerun the corrected command. A later passing command does not erase the failed check.

Before delivery, compare the validation section against the terminal history. Include the literal successful commands and their literal outputs in fenced blocks. Statements such as “confirmed,” “checked,” or “`git diff --check`: passed” do not satisfy the evidence gate. If the response omits the commands because they are long, do not claim validation.

For `creator-operations-base-v1`, run the Skill's `scripts/validate-base-package.mjs` from the repository root. It covers the shared contract and automatically invokes validators for applicable Task Prompt files. Record that literal command and complete output; add only `git diff --check` and source-document diff checks for the current change. Do not rerun covered invariants with improvised `rg`, `jq`, or inline scripts. Preserve each real exit code exactly; a no-match search normally exits `1` and must never be reported as `0`.

## Required static checks

### Package and version

- inspect changed files;
- run `git diff --check`;
- verify the intended Prompt Version in every deliverable;
- reject TODO, TBD, placeholder, or stale-version text;
- confirm source documents were not modified by Prompt development.

### Public envelope

Assert the exact current top-level keys and wire values from the active field specification. Validate:

- complete non-empty Display Text;
- `task_output` object;
- documented empty arrays and objects rather than ad hoc `null`;
- task type maps to the correct generation mode;
- missing prerequisite approval yields the common non-generative response.

Do not stop at a top-level parse. The executable assertion must also cover every applicable item below; naming an invariant in prose is not evidence that it was checked.

### Non-empty metadata

Extract and parse at least one non-empty JSON example. Assert:

- exact required keys;
- types and enum membership;
- minimum array cardinality;
- unique response-local IDs;
- every referenced ID exists;
- Knowledge Conflict retains at least two positions;
- Blocking Content Risk has blocking severity;
- risk is visible in both `risk_flags` and Display Text.

The example used by the assertion must itself be non-empty. Do not validate an empty fixture while merely displaying a separate non-empty example.

### Layer boundaries

Search the shared Base Prompt for task-only or platform-only output fields. Search Task Prompts for new common top-level fields. Reject either form of leakage.

Record the literal search commands and their outputs. Use a search expression supported by the selected tool; a regex parse error is a failed validation even when no matches were printed.

## Review passes

### Task review

Compare the artifact against the requested task, source decisions, active contract, and explicit exclusions.

### Whole-package review

Check all Prompt layers together for:

- contract drift;
- approval bypass through “partial”, “draft”, or “confirm later” output;
- model knowledge overriding Creator authority;
- conflict adjudication;
- privacy or public-use bypass;
- risk hidden from Display Text;
- upstream approval inherited by a newly generated result;
- validation claims unsupported by recorded commands.

Fix Important findings, rerun covering checks, and repeat review. Record Minor findings rather than silently discarding them.
