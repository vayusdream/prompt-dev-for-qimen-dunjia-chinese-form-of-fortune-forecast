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
      "content-master-prompt-definition.md",
    );
const fail = (message) => {
  throw new Error(message);
};
const pass = (message) => console.log(`PASS ${message}`);
const nonempty = (value) => typeof value === "string" && value.length > 0;
const exactKeys = (value, keys) =>
  value &&
  !Array.isArray(value) &&
  JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());

if (!fs.existsSync(file)) fail(`missing Content Master Prompt Definition: ${file}`);
const text = fs.readFileSync(file, "utf8");
pass("Content Master Prompt Definition exists");

for (const phrase of [
  "creator-operations-base-v1",
  "content_master_expansion",
  "Grounded Creation Mode",
  "Topic Approval",
  "Review Draft",
  "Master Approval",
  "Knowledge Trace",
  "Knowledge Conflict",
  "Unverified Claim",
  "Blocking Content Risk",
  "untrusted data",
]) {
  if (!text.includes(phrase)) fail(`missing required phrase: ${phrase}`);
}
for (const phrase of [
  "If Topic Approval is absent or uncertain",
  "`task_output` set to `{}`",
]) {
  if (!text.includes(phrase)) fail(`missing approval gate: ${phrase}`);
}
pass("task mode terminology and approval boundaries");

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
const successMatch = text.match(
  /## Non-empty Generation Response example[\s\S]*?```json\n([\s\S]*?)\n```/,
);
if (!successMatch) fail("non-empty Content Master example not found");
const response = JSON.parse(successMatch[1]);
if (!exactKeys(response, topKeys)) fail("public envelope drift");
if (response.prompt_version !== "creator-operations-base-v1") fail("prompt version");
if (response.generation_task_type !== "content_master_expansion") {
  fail("task wire value");
}
if (!nonempty(response.display_text)) fail("display text");
if (response.generation_notes?.mode !== "grounded_creation") {
  fail("generation mode");
}
pass("public envelope and Grounded Creation Mode");

const gateMatch = text.match(
  /## Missing Topic Approval response example[\s\S]*?```json\n([\s\S]*?)\n```/,
);
if (!gateMatch) fail("missing Topic Approval response example not found");
const gated = JSON.parse(gateMatch[1]);
if (!exactKeys(gated, topKeys)) fail("approval response envelope drift");
if (gated.generation_task_type !== "content_master_expansion") {
  fail("approval response task type");
}
if (!exactKeys(gated.task_output, [])) fail("approval response task_output");
if (!gated.confirmation_items.some((item) =>
  item.confirmation_type === "approval" &&
  item.blocking === true &&
  item.prompt.includes("Topic Approval")
)) {
  fail("approval response confirmation");
}
if (!gated.display_text.includes("Topic Approval")) {
  fail("approval response Display Text");
}
pass("missing Topic Approval non-generative response");

if (!exactKeys(response.task_output, ["content_master"])) fail("task_output keys");
const master = response.task_output.content_master;
const masterKeys = [
  "id",
  "source_topic",
  "target_audience",
  "core_question",
  "content_goal",
  "creator_position",
  "professional_claims",
  "argument_structure",
  "cross_platform_draft",
  "expression_boundaries",
  "source_reference_ids",
];
if (!exactKeys(master, masterKeys)) fail("Content Master keys");
for (const key of ["id", "target_audience", "core_question", "content_goal"]) {
  if (!nonempty(master[key])) fail(`Content Master ${key}`);
}
if (!exactKeys(master.source_topic, [
  "topic_candidate_id",
  "title",
  "audience_basis",
  "core_question",
  "content_angle",
  "topic_approval_reference",
])) {
  fail("source topic keys");
}
for (const key of [
  "topic_candidate_id",
  "title",
  "core_question",
  "content_angle",
  "topic_approval_reference",
]) {
  if (!nonempty(master.source_topic[key])) fail("source topic values");
}
if (
  !exactKeys(master.source_topic.audience_basis, [
    "basis_type",
    "text",
    "source_reference_ids",
  ]) ||
  !["audience_question", "creator_input", "model_hypothesis"].includes(
    master.source_topic.audience_basis.basis_type,
  ) ||
  !nonempty(master.source_topic.audience_basis.text) ||
  !Array.isArray(master.source_topic.audience_basis.source_reference_ids)
) {
  fail("source topic audience basis");
}
if (!exactKeys(master.creator_position, ["summary", "source_reference_ids"])) {
  fail("Creator position keys");
}
if (
  !nonempty(master.creator_position.summary) ||
  !Array.isArray(master.creator_position.source_reference_ids) ||
  master.creator_position.source_reference_ids.length === 0
) {
  fail("Creator position values");
}
pass("Content Master core shape");

const claimKeys = ["id", "claim", "status", "source_reference_ids"];
if (!Array.isArray(master.professional_claims) || master.professional_claims.length < 2) {
  fail("professional claim cardinality");
}
for (const claim of master.professional_claims) {
  if (!exactKeys(claim, claimKeys)) fail("professional claim keys");
  if (
    !nonempty(claim.id) ||
    !nonempty(claim.claim) ||
    !["supported", "unverified_claim"].includes(claim.status) ||
    !Array.isArray(claim.source_reference_ids) ||
    (claim.status === "supported" && claim.source_reference_ids.length === 0)
  ) {
    fail("professional claim values");
  }
}
const claimIds = master.professional_claims.map((item) => item.id);
if (new Set(claimIds).size !== claimIds.length) fail("unique professional claim IDs");

if (!Array.isArray(master.argument_structure) || master.argument_structure.length < 2) {
  fail("argument structure cardinality");
}
for (const section of master.argument_structure) {
  if (!exactKeys(section, [
    "section_id",
    "purpose",
    "key_points",
    "professional_claim_ids",
  ])) {
    fail("argument section keys");
  }
  if (
    !nonempty(section.section_id) ||
    !nonempty(section.purpose) ||
    !Array.isArray(section.key_points) ||
    section.key_points.length === 0 ||
    section.key_points.some((item) => !nonempty(item)) ||
    !Array.isArray(section.professional_claim_ids) ||
    section.professional_claim_ids.some((id) => !claimIds.includes(id))
  ) {
    fail("argument section values");
  }
}
const argumentIds = master.argument_structure.map((item) => item.section_id);
if (new Set(argumentIds).size !== argumentIds.length) {
  fail("unique argument section IDs");
}

if (!exactKeys(master.cross_platform_draft, [
  "title",
  "opening",
  "body_sections",
  "closing",
])) {
  fail("cross-platform draft keys");
}
if (
  !nonempty(master.cross_platform_draft.title) ||
  !nonempty(master.cross_platform_draft.opening) ||
  !nonempty(master.cross_platform_draft.closing) ||
  !Array.isArray(master.cross_platform_draft.body_sections) ||
  master.cross_platform_draft.body_sections.length !== master.argument_structure.length
) {
  fail("cross-platform draft values");
}
for (const section of master.cross_platform_draft.body_sections) {
  if (!exactKeys(section, [
    "section_id",
    "heading",
    "paragraphs",
    "professional_claim_ids",
  ])) {
    fail("draft section keys");
  }
  if (
    !argumentIds.includes(section.section_id) ||
    !nonempty(section.heading) ||
    !Array.isArray(section.paragraphs) ||
    section.paragraphs.length === 0 ||
    section.paragraphs.some((item) => !nonempty(item)) ||
    !Array.isArray(section.professional_claim_ids) ||
    section.professional_claim_ids.some((id) => !claimIds.includes(id))
  ) {
    fail("draft section values");
  }
}
if (
  JSON.stringify(
    master.cross_platform_draft.body_sections.map((item) => item.section_id),
  ) !== JSON.stringify(argumentIds)
) {
  fail("draft and argument section order");
}
if (!exactKeys(master.expression_boundaries, [
  "required_expressions",
  "prohibited_expressions",
])) {
  fail("expression boundary keys");
}
if (
  !Array.isArray(master.expression_boundaries.required_expressions) ||
  !Array.isArray(master.expression_boundaries.prohibited_expressions) ||
  master.expression_boundaries.prohibited_expressions.length === 0 ||
  [...master.expression_boundaries.required_expressions,
    ...master.expression_boundaries.prohibited_expressions].some(
      (item) => !nonempty(item),
    )
) {
  fail("expression boundary values");
}
pass("claims structure draft and expression boundaries");

const sourceTypes = new Set([
  "authority_rule",
  "confirmed_knowledge_entry",
  "reference_material",
  "historical_expression",
  "creator_input",
  "sanitized_case",
  "model_background",
]);
if (!Array.isArray(response.source_references) || response.source_references.length < 2) {
  fail("source reference cardinality");
}
for (const item of response.source_references) {
  if (!exactKeys(item, ["id", "source_type", "label", "locator", "supports"])) {
    fail("source reference keys");
  }
  if (
    !nonempty(item.id) ||
    !sourceTypes.has(item.source_type) ||
    !nonempty(item.label) ||
    typeof item.locator !== "string" ||
    !Array.isArray(item.supports) ||
    item.supports.some((value) => !nonempty(value))
  ) {
    fail("source reference values");
  }
}
const sourceIds = new Set(response.source_references.map((item) => item.id));
if (sourceIds.size !== response.source_references.length) {
  fail("unique source reference IDs");
}
const allSourceRefs = [
  ...master.source_reference_ids,
  ...master.source_topic.audience_basis.source_reference_ids,
  ...master.creator_position.source_reference_ids,
  ...master.professional_claims.flatMap((item) => item.source_reference_ids),
];
if (
  !Array.isArray(master.source_reference_ids) ||
  allSourceRefs.some((id) => !sourceIds.has(id))
) {
  fail("Content Master source references");
}
if (
  master.source_topic.audience_basis.basis_type === "audience_question" &&
  master.source_topic.audience_basis.source_reference_ids.length === 0
) {
  fail("Audience Question source reference");
}
if (!Array.isArray(response.knowledge_conflicts) || !response.knowledge_conflicts.length) {
  fail("non-empty conflict example");
}
for (const conflict of response.knowledge_conflicts) {
  if (!exactKeys(conflict, [
    "id",
    "subject",
    "positions",
    "confirmation_question",
  ])) {
    fail("Knowledge Conflict keys");
  }
  if (
    !nonempty(conflict.id) ||
    !nonempty(conflict.subject) ||
    !nonempty(conflict.confirmation_question) ||
    !Array.isArray(conflict.positions) ||
    conflict.positions.length < 2
  ) {
    fail("Knowledge Conflict values");
  }
  for (const position of conflict.positions) {
    if (!exactKeys(position, ["summary", "source_reference_ids"])) {
      fail("Knowledge Conflict position keys");
    }
    if (
      !nonempty(position.summary) ||
      !Array.isArray(position.source_reference_ids) ||
      position.source_reference_ids.length === 0 ||
      position.source_reference_ids.some((id) => !sourceIds.has(id))
    ) {
      fail("Knowledge Conflict position values");
    }
  }
}
if (!Array.isArray(response.risk_flags) || !response.risk_flags.length) {
  fail("non-empty risk example");
}
for (const risk of response.risk_flags) {
  if (!exactKeys(risk, [
    "id",
    "risk_type",
    "severity",
    "description",
    "required_action",
  ])) {
    fail("risk keys");
  }
  if (
    !nonempty(risk.id) ||
    ![
      "blocking_content_risk",
      "privacy",
      "missing_sanitization",
      "missing_public_use_clearance",
      "other",
    ].includes(risk.risk_type) ||
    !["blocking", "warning"].includes(risk.severity) ||
    !nonempty(risk.description) ||
    !nonempty(risk.required_action)
  ) {
    fail("risk values");
  }
}
if (!response.risk_flags.some((item) =>
  item.risk_type === "blocking_content_risk" &&
  item.severity === "blocking" &&
  response.display_text.includes(item.description)
)) {
  fail("blocking risk dual visibility");
}
const confirmationTypes = new Set([
  "approval",
  "fact",
  "knowledge_conflict",
  "sanitization",
  "public_use_clearance",
  "professional_judgment",
  "other",
]);
const relatedTargets = new Set([
  ...sourceIds,
  ...response.knowledge_conflicts.map((item) => item.id),
  ...response.risk_flags.map((item) => item.id),
]);
if (!Array.isArray(response.confirmation_items) || !response.confirmation_items.length) {
  fail("confirmation cardinality");
}
for (const item of response.confirmation_items) {
  if (!exactKeys(item, [
    "id",
    "confirmation_type",
    "prompt",
    "blocking",
    "related_ids",
  ])) {
    fail("confirmation keys");
  }
  if (
    !nonempty(item.id) ||
    !confirmationTypes.has(item.confirmation_type) ||
    !nonempty(item.prompt) ||
    typeof item.blocking !== "boolean" ||
    !Array.isArray(item.related_ids) ||
    item.related_ids.some((id) => !relatedTargets.has(id))
  ) {
    fail("confirmation values");
  }
}
if (!response.confirmation_items.some((item) =>
  item.confirmation_type === "approval" &&
  item.blocking === true &&
  item.prompt.includes("Master Approval")
)) {
  fail("Master Approval confirmation");
}
if (!exactKeys(response.generation_notes, [
  "mode",
  "limitations",
  "handling_notes",
])) {
  fail("generation notes keys");
}
if (
  response.generation_notes.mode !== "grounded_creation" ||
  !Array.isArray(response.generation_notes.limitations) ||
  !Array.isArray(response.generation_notes.handling_notes) ||
  [...response.generation_notes.limitations,
    ...response.generation_notes.handling_notes].some(
      (item) => !nonempty(item),
    )
) {
  fail("generation notes values");
}
const responseIds = [
  master.id,
  ...claimIds,
  ...argumentIds,
  ...response.source_references.map((item) => item.id),
  ...response.knowledge_conflicts.map((item) => item.id),
  ...response.risk_flags.map((item) => item.id),
  ...response.confirmation_items.map((item) => item.id),
];
if (new Set(responseIds).size !== responseIds.length) {
  fail("unique response-local IDs");
}
pass("references conflicts risks and Master Approval");

const normalizedDisplayText = response.display_text.replace(
  /[\s。；，：、“”‘’？！]/g,
  "",
);
for (const value of [
  master.source_topic.title,
  master.source_topic.audience_basis.text,
  master.source_topic.core_question,
  master.target_audience,
  master.core_question,
  master.content_goal,
  master.creator_position.summary,
  master.cross_platform_draft.title,
  master.cross_platform_draft.opening,
  master.cross_platform_draft.closing,
  ...master.professional_claims.map((item) => item.claim),
  ...master.argument_structure.flatMap((item) => [
    item.purpose,
    ...item.key_points,
  ]),
  ...master.cross_platform_draft.body_sections.flatMap((item) => [
    item.heading,
    ...item.paragraphs,
  ]),
  ...master.expression_boundaries.required_expressions,
  ...master.expression_boundaries.prohibited_expressions,
]) {
  const normalizedValue = value.replace(/[\s。；，：、“”‘’？！]/g, "");
  if (!normalizedDisplayText.includes(normalizedValue)) {
    fail(`Display Text omits Content Master review content: ${value}`);
  }
}
if (!response.display_text.includes("Review Draft")) fail("Review Draft visibility");
if (!response.display_text.includes("Master Approval")) {
  fail("Master Approval visibility");
}
pass("complete Content Master review content in Display Text");

const forbiddenTaskKeys = new Set([
  "cover_text",
  "card_pages",
  "hashtags",
  "opening_hook",
  "spoken_script",
  "shot_list",
  "subtitle_highlights",
  "interaction_prompt",
]);
const visit = (value) => {
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (forbiddenTaskKeys.has(key)) fail(`platform field leakage: ${key}`);
    visit(nested);
  }
};
visit(response.task_output);
pass("no platform package field leakage");

console.log("RESULT content-master-prompt validation: PASS");
