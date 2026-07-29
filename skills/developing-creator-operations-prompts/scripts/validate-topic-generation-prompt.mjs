import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? ".");
const file = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(
      root,
      "creator-operations",
      "prompts",
      "creator-operations-base-v1",
      "topic-generation-prompt-definition.md",
    );
const fail = (message) => {
  throw new Error(message);
};
const pass = (message) => console.log(`PASS ${message}`);
const nonempty = (value) => typeof value === "string" && value.length > 0;
const exactKeys = (value, keys) =>
  JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());

if (!fs.existsSync(file)) fail(`missing Topic Prompt Definition: ${file}`);
const text = fs.readFileSync(file, "utf8");
pass("Topic Prompt Definition exists");

for (const phrase of [
  "creator-operations-base-v1",
  "topic_generation",
  "Exploration Mode",
  "Generated Topic Proposal",
  "Topic Candidate",
  "Topic Approval",
  "Knowledge Conflict",
  "Unverified Claim",
  "`task_output`",
  "untrusted data",
]) {
  if (!text.includes(phrase)) fail(`missing required phrase: ${phrase}`);
}
if (!/exactly 5|恰好 5|固定为 5/.test(text)) fail("missing five-candidate invariant");
pass("task mode terminology approval and candidate invariant");

const match = text.match(
  /## Non-empty Generation Response example[\s\S]*?```json\n([\s\S]*?)\n```/,
);
if (!match) fail("non-empty topic example not found");
const response = JSON.parse(match[1]);
pass("non-empty topic example parses");

const topKeys = [
  "prompt_version",
  "generation_task_type",
  "display_text",
  "task_output",
  "source_references",
  "knowledge_conflicts",
  "risk_flags",
  "confirmation_items",
  "generation_notes",
];
if (!exactKeys(response, topKeys)) fail("public envelope drift");
if (response.prompt_version !== "creator-operations-base-v1") fail("prompt version");
if (response.generation_task_type !== "topic_generation") fail("task wire value");
if (!nonempty(response.display_text)) fail("display text");
if (response.generation_notes?.mode !== "exploration") fail("generation mode");
pass("public envelope and Exploration Mode");

if (!exactKeys(response.task_output, ["topic_proposal_batch"])) fail("task_output keys");
const batch = response.task_output.topic_proposal_batch;
if (!exactKeys(batch, ["candidate_count", "proposals"])) fail("batch keys");
if (batch.candidate_count !== 5 || batch.proposals?.length !== 5) {
  fail("Topic Proposal Batch must contain exactly five proposals");
}

const proposalKeys = [
  "id",
  "title",
  "audience_basis",
  "core_question",
  "content_angle",
  "content_goal",
  "target_platforms",
  "timeliness_basis",
  "professional_hypotheses",
  "source_reference_ids",
  "differentiation",
  "duplication_note",
];
const platformValues = new Set(["xiaohongshu", "douyin"]);
const audienceValues = new Set([
  "audience_question",
  "creator_input",
  "model_hypothesis",
]);
const timelinessValues = new Set([
  "topic_signal",
  "creator_input",
  "model_background",
  "none",
]);
for (const proposal of batch.proposals) {
  if (!exactKeys(proposal, proposalKeys)) fail("proposal keys");
  for (const key of [
    "id",
    "title",
    "core_question",
    "content_angle",
    "content_goal",
    "differentiation",
    "duplication_note",
  ]) {
    if (!nonempty(proposal[key])) fail(`proposal ${key}`);
  }
  if (
    !exactKeys(proposal.audience_basis, [
      "basis_type",
      "text",
      "source_reference_ids",
    ]) ||
    !audienceValues.has(proposal.audience_basis.basis_type) ||
    !nonempty(proposal.audience_basis.text)
  ) {
    fail("audience basis");
  }
  if (
    !exactKeys(proposal.timeliness_basis, [
      "basis_type",
      "summary",
      "source_reference_ids",
    ]) ||
    !timelinessValues.has(proposal.timeliness_basis.basis_type) ||
    !nonempty(proposal.timeliness_basis.summary)
  ) {
    fail("timeliness basis");
  }
  if (
    !Array.isArray(proposal.target_platforms) ||
    proposal.target_platforms.some((item) => !platformValues.has(item))
  ) {
    fail("target platforms");
  }
  if (
    !Array.isArray(proposal.professional_hypotheses) ||
    proposal.professional_hypotheses.some(
      (item) =>
        !exactKeys(item, ["claim", "status", "source_reference_ids"]) ||
        !nonempty(item.claim) ||
        !["supported", "unverified_claim"].includes(item.status) ||
        !Array.isArray(item.source_reference_ids),
    )
  ) {
    fail("professional hypotheses");
  }
  for (const refs of [
    proposal.source_reference_ids,
    proposal.audience_basis.source_reference_ids,
    proposal.timeliness_basis.source_reference_ids,
    ...proposal.professional_hypotheses.map((item) => item.source_reference_ids),
  ]) {
    if (!Array.isArray(refs)) fail("proposal references");
  }
}
const proposalIds = batch.proposals.map((item) => item.id);
if (new Set(proposalIds).size !== proposalIds.length) fail("unique proposal IDs");
pass("five proposal task payload shape");

for (const proposal of batch.proposals) {
  for (const reviewText of [
    proposal.title,
    proposal.audience_basis.text,
    proposal.core_question,
    proposal.content_angle,
  ]) {
    if (!response.display_text.includes(reviewText)) {
      fail(`Display Text omits proposal review content: ${proposal.id}`);
    }
  }
}
pass("complete proposal review content in Display Text");

const sourceIds = new Set(response.source_references.map((item) => item.id));
for (const proposal of batch.proposals) {
  const refs = [
    ...proposal.source_reference_ids,
    ...proposal.audience_basis.source_reference_ids,
    ...proposal.timeliness_basis.source_reference_ids,
    ...proposal.professional_hypotheses.flatMap(
      (item) => item.source_reference_ids,
    ),
  ];
  if (refs.some((id) => !sourceIds.has(id))) fail("unknown proposal source reference");
}
pass("proposal response-local references");

if (!response.knowledge_conflicts.length) fail("non-empty conflict example");
if (!response.confirmation_items.length) fail("non-empty confirmation example");
if (
  response.knowledge_conflicts.some((item) => item.positions.length < 2)
) {
  fail("conflict positions");
}
if (!response.display_text.includes("未裁决")) fail("conflict visibility");
if (!response.display_text.includes("Topic Approval")) fail("approval visibility");
pass("conflict preservation and human Topic Approval");

console.log("RESULT topic-generation-prompt validation: PASS");
