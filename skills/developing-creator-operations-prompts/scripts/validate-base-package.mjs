import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(process.argv[2] ?? ".");
const version = "creator-operations-base-v1";
const dir = path.join(root, "creator-operations", "prompts", version);
const files = {
  base: path.join(dir, "base-prompt-definition.md"),
  fields: path.join(dir, "generation-response-field-specification.md"),
  rules: path.join(dir, "non-negotiable-rules.md"),
};
const fail = (message) => {
  throw new Error(message);
};
const pass = (message) => console.log(`PASS ${message}`);
const nonempty = (value) => typeof value === "string" && value.length > 0;
const exactKeys = (value, keys) =>
  JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());

for (const [name, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) fail(`missing ${name}: ${file}`);
}
pass("expected deliverables exist");

const text = Object.fromEntries(
  Object.entries(files).map(([name, file]) => [name, fs.readFileSync(file, "utf8")]),
);
for (const [name, value] of Object.entries(text)) {
  const versions = [...value.matchAll(/creator-operations-base-v\d+/g)].map((m) => m[0]);
  if (!versions.length || versions.some((item) => item !== version)) {
    fail(`${name} contains missing or stale version`);
  }
}
pass("version consistency");

const match = text.fields.match(
  /## Generic valid JSON example[\s\S]*?```json\n([\s\S]*?)\n```/,
);
if (!match) fail("non-empty JSON example not found");
const response = JSON.parse(match[1]);
pass("non-empty JSON parses");

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
if (!exactKeys(response, topKeys)) fail("top-level keys");
if (response.prompt_version !== version) fail("prompt_version");
const taskTypes = [
  "topic_generation",
  "content_master_expansion",
  "platform_text_adaptation",
];
if (!taskTypes.includes(response.generation_task_type)) fail("generation_task_type");
if (!nonempty(response.display_text)) fail("display_text");
if (!response.task_output || Array.isArray(response.task_output)) fail("task_output");
pass("public envelope keys and wire values");

const sourceTypes = [
  "authority_rule",
  "confirmed_knowledge_entry",
  "reference_material",
  "historical_expression",
  "creator_input",
  "sanitized_case",
  "model_background",
];
const riskTypes = [
  "blocking_content_risk",
  "privacy",
  "missing_sanitization",
  "missing_public_use_clearance",
  "other",
];
const confirmationTypes = [
  "approval",
  "fact",
  "knowledge_conflict",
  "sanitization",
  "public_use_clearance",
  "professional_judgment",
  "other",
];
if (response.source_references.length < 1) fail("source cardinality");
for (const item of response.source_references) {
  if (!exactKeys(item, ["id", "source_type", "label", "locator", "supports"])) fail("source keys");
  if (!nonempty(item.id) || !sourceTypes.includes(item.source_type) || !nonempty(item.label)) fail("source types");
  if (typeof item.locator !== "string" || !Array.isArray(item.supports) || item.supports.some((x) => !nonempty(x))) fail("source values");
}
if (response.knowledge_conflicts.length < 1) fail("conflict cardinality");
for (const item of response.knowledge_conflicts) {
  if (!exactKeys(item, ["id", "subject", "positions", "confirmation_question"])) fail("conflict keys");
  if (!nonempty(item.id) || !nonempty(item.subject) || !nonempty(item.confirmation_question) || item.positions.length < 2) fail("conflict values");
  for (const position of item.positions) {
    if (!exactKeys(position, ["summary", "source_reference_ids"])) fail("position keys");
    if (!nonempty(position.summary) || !position.source_reference_ids.length) fail("position values");
  }
}
if (response.risk_flags.length < 1) fail("risk cardinality");
for (const item of response.risk_flags) {
  if (!exactKeys(item, ["id", "risk_type", "severity", "description", "required_action"])) fail("risk keys");
  if (!nonempty(item.id) || !riskTypes.includes(item.risk_type) || !["blocking", "warning"].includes(item.severity) || !nonempty(item.description) || !nonempty(item.required_action)) fail("risk values");
}
if (response.confirmation_items.length < 1) fail("confirmation cardinality");
for (const item of response.confirmation_items) {
  if (!exactKeys(item, ["id", "confirmation_type", "prompt", "blocking", "related_ids"])) fail("confirmation keys");
  if (!nonempty(item.id) || !confirmationTypes.includes(item.confirmation_type) || !nonempty(item.prompt) || typeof item.blocking !== "boolean" || !Array.isArray(item.related_ids)) fail("confirmation values");
}
if (!exactKeys(response.generation_notes, ["mode", "limitations", "handling_notes"])) fail("notes keys");
if (!["exploration", "grounded_creation"].includes(response.generation_notes.mode)) fail("mode enum");
if (![...response.generation_notes.limitations, ...response.generation_notes.handling_notes].every(nonempty)) fail("notes arrays");
pass("nested keys types enums and cardinality");

const allItems = [
  ...response.source_references,
  ...response.knowledge_conflicts,
  ...response.risk_flags,
  ...response.confirmation_items,
];
const allIds = allItems.map((item) => item.id);
if (new Set(allIds).size !== allIds.length) fail("unique IDs");
const sourceIds = new Set(response.source_references.map((item) => item.id));
for (const conflict of response.knowledge_conflicts) {
  for (const position of conflict.positions) {
    if (position.source_reference_ids.some((id) => !sourceIds.has(id))) fail("source reference");
  }
}
const relatedTargets = new Set([
  ...sourceIds,
  ...response.knowledge_conflicts.map((item) => item.id),
  ...response.risk_flags.map((item) => item.id),
]);
for (const item of response.confirmation_items) {
  if (item.related_ids.some((id) => !relatedTargets.has(id))) fail("related reference");
}
pass("unique response-local IDs and references");

const blocking = response.risk_flags.filter(
  (item) => item.risk_type === "blocking_content_risk",
);
if (!blocking.length || blocking.some((item) => item.severity !== "blocking")) {
  fail("blocking risk severity");
}
if (!response.display_text.includes("阻断") || !response.display_text.includes("风险")) {
  fail("blocking risk visibility");
}
pass("blocking risk severity and Display Text visibility");

const approvalChecks = [
  /Content Master expansion requires explicit Topic Approval/,
  /Platform text adaptation requires explicit Master Approval/,
  /task_output` set to `\{\}`/,
  /display_text/,
  /confirmation_items/,
];
if (approvalChecks.some((pattern) => !pattern.test(text.base))) fail("approval gate wording");
if (!/add it to `risk_flags`/.test(text.base) || !/in `display_text`/.test(text.base)) {
  fail("dual risk wording");
}
pass("approval gates and dual risk visibility wording");

const forbiddenBaseTerms = [
  "xiaohongshu",
  "douyin",
  "opening_hook",
  "spoken_script",
  "cover_text",
  "topic_proposal_batch",
];
if (forbiddenBaseTerms.some((term) => text.base.toLowerCase().includes(term))) {
  fail("task or platform leakage in Base Prompt");
}
pass("shared Base Prompt task and platform neutrality");

for (const taskType of taskTypes) {
  const simulated = { ...response, generation_task_type: taskType, task_output: {} };
  if (!exactKeys(simulated, topKeys) || simulated.generation_task_type !== taskType) {
    fail(`simulation ${taskType}`);
  }
}
pass("three task simulations reuse one envelope");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
execFileSync(
  process.execPath,
  [path.join(scriptDir, "validate-topic-generation-prompt.mjs"), root],
  { stdio: "inherit" },
);
pass("Topic Generation Task Prompt validator");
execFileSync(
  process.execPath,
  [path.join(scriptDir, "validate-content-master-prompt.mjs"), root],
  { stdio: "inherit" },
);
pass("Content Master Task Prompt validator");
execFileSync(
  process.execPath,
  [path.join(scriptDir, "validate-platform-adaptation-prompt.mjs"), root],
  { stdio: "inherit" },
);
pass("Platform Adaptation Task Prompt validator");
console.log("RESULT creator-operations-base-v1 validation: PASS");
