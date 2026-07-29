import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? ".");
const promptDir = path.join(
  root,
  "creator-operations",
  "prompts",
  "creator-operations-base-v1",
);
const files = {
  task: path.join(promptDir, "platform-adaptation-prompt-definition.md"),
  xiaohongshu: path.join(promptDir, "xiaohongshu-platform-rules.md"),
  douyin: path.join(promptDir, "douyin-platform-rules.md"),
};
const fail = (message) => {
  throw new Error(message);
};
const pass = (message) => console.log(`PASS ${message}`);
const nonempty = (value) => typeof value === "string" && value.length > 0;
const exactKeys = (value, keys) =>
  value &&
  !Array.isArray(value) &&
  JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());

for (const [name, file] of Object.entries(files)) {
  if (!fs.existsSync(file)) fail(`missing ${name} Prompt Definition: ${file}`);
}
const text = Object.fromEntries(
  Object.entries(files).map(([name, file]) => [
    name,
    fs.readFileSync(file, "utf8"),
  ]),
);
pass("Platform Adaptation Task Prompt and platform rules exist");

for (const phrase of [
  "creator-operations-base-v1",
  "platform_text_adaptation",
  "Grounded Creation Mode",
  "Master Approval",
  "Review Draft",
  "Platform Approval",
  "Publication Approval",
  "Blocking Content Risk",
  "one target platform",
  "untrusted data",
]) {
  if (!text.task.includes(phrase)) fail(`missing task phrase: ${phrase}`);
}
for (const phrase of [
  "If Master Approval is absent or uncertain",
  "`task_output` set to `{}`",
]) {
  if (!text.task.includes(phrase)) fail(`missing approval gate: ${phrase}`);
}
if (!text.xiaohongshu.includes("Xiaohongshu Package")) {
  fail("missing Xiaohongshu Package rules");
}
if (!text.douyin.includes("Douyin Package")) {
  fail("missing Douyin Package rules");
}
pass("task mode single-platform and approval boundaries");

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
const parseExample = (heading) => {
  const match = text.task.match(
    new RegExp(`## ${heading}[\\s\\S]*?\`\`\`json\\n([\\s\\S]*?)\\n\`\`\``),
  );
  if (!match) fail(`missing example: ${heading}`);
  return JSON.parse(match[1]);
};
const xhs = parseExample("Xiaohongshu Generation Response example");
const douyin = parseExample("Douyin Generation Response example");
const gated = parseExample("Missing Master Approval response example");
pass("Xiaohongshu Douyin and approval examples parse");

const validateEnvelope = (response, label) => {
  if (!exactKeys(response, topKeys)) fail(`${label} public envelope`);
  if (response.prompt_version !== "creator-operations-base-v1") {
    fail(`${label} prompt version`);
  }
  if (response.generation_task_type !== "platform_text_adaptation") {
    fail(`${label} task type`);
  }
  if (!nonempty(response.display_text)) fail(`${label} Display Text`);
  if (response.generation_notes?.mode !== "grounded_creation") {
    fail(`${label} generation mode`);
  }
};
validateEnvelope(xhs, "Xiaohongshu");
validateEnvelope(douyin, "Douyin");
validateEnvelope(gated, "approval");
pass("public envelope and Grounded Creation Mode");

const sourceTypes = new Set([
  "authority_rule",
  "confirmed_knowledge_entry",
  "reference_material",
  "historical_expression",
  "creator_input",
  "sanitized_case",
  "model_background",
]);
const confirmationTypes = new Set([
  "approval",
  "fact",
  "knowledge_conflict",
  "sanitization",
  "public_use_clearance",
  "professional_judgment",
  "other",
]);
const validateSharedMetadata = (response, label) => {
  if (!Array.isArray(response.source_references) || response.source_references.length === 0) {
    fail(`${label} source cardinality`);
  }
  for (const item of response.source_references) {
    if (!exactKeys(item, ["id", "source_type", "label", "locator", "supports"])) {
      fail(`${label} source keys`);
    }
    if (
      !nonempty(item.id) ||
      !sourceTypes.has(item.source_type) ||
      !nonempty(item.label) ||
      typeof item.locator !== "string" ||
      !Array.isArray(item.supports) ||
      item.supports.some((value) => !nonempty(value))
    ) {
      fail(`${label} source values`);
    }
  }
  const sourceIds = new Set(response.source_references.map((item) => item.id));
  if (sourceIds.size !== response.source_references.length) {
    fail(`${label} unique source IDs`);
  }
  if (!Array.isArray(response.knowledge_conflicts)) {
    fail(`${label} conflicts`);
  }
  for (const conflict of response.knowledge_conflicts) {
    if (!exactKeys(conflict, [
      "id",
      "subject",
      "positions",
      "confirmation_question",
    ])) {
      fail(`${label} conflict keys`);
    }
    if (
      !nonempty(conflict.id) ||
      !nonempty(conflict.subject) ||
      !nonempty(conflict.confirmation_question) ||
      !Array.isArray(conflict.positions) ||
      conflict.positions.length < 2
    ) {
      fail(`${label} conflict values`);
    }
    for (const position of conflict.positions) {
      if (!exactKeys(position, ["summary", "source_reference_ids"])) {
        fail(`${label} conflict position keys`);
      }
      if (
        !nonempty(position.summary) ||
        !Array.isArray(position.source_reference_ids) ||
        position.source_reference_ids.length === 0 ||
        position.source_reference_ids.some((id) => !sourceIds.has(id))
      ) {
        fail(`${label} conflict position values`);
      }
    }
  }
  if (!Array.isArray(response.risk_flags)) fail(`${label} risks`);
  for (const risk of response.risk_flags) {
    if (!exactKeys(risk, [
      "id",
      "risk_type",
      "severity",
      "description",
      "required_action",
    ])) {
      fail(`${label} risk keys`);
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
      fail(`${label} risk values`);
    }
  }
  const relatedTargets = new Set([
    ...sourceIds,
    ...response.knowledge_conflicts.map((item) => item.id),
    ...response.risk_flags.map((item) => item.id),
  ]);
  if (!Array.isArray(response.confirmation_items) || response.confirmation_items.length === 0) {
    fail(`${label} confirmation cardinality`);
  }
  for (const item of response.confirmation_items) {
    if (!exactKeys(item, [
      "id",
      "confirmation_type",
      "prompt",
      "blocking",
      "related_ids",
    ])) {
      fail(`${label} confirmation keys`);
    }
    if (
      !nonempty(item.id) ||
      !confirmationTypes.has(item.confirmation_type) ||
      !nonempty(item.prompt) ||
      typeof item.blocking !== "boolean" ||
      !Array.isArray(item.related_ids) ||
      item.related_ids.some((id) => !relatedTargets.has(id))
    ) {
      fail(`${label} confirmation values`);
    }
  }
  if (!exactKeys(response.generation_notes, [
    "mode",
    "limitations",
    "handling_notes",
  ])) {
    fail(`${label} notes keys`);
  }
  if (
    !Array.isArray(response.generation_notes.limitations) ||
    !Array.isArray(response.generation_notes.handling_notes) ||
    [...response.generation_notes.limitations,
      ...response.generation_notes.handling_notes].some(
        (item) => !nonempty(item),
      )
  ) {
    fail(`${label} notes values`);
  }
  const ids = [
    ...response.source_references,
    ...response.knowledge_conflicts,
    ...response.risk_flags,
    ...response.confirmation_items,
  ].map((item) => item.id);
  if (new Set(ids).size !== ids.length) fail(`${label} unique shared IDs`);
};
validateSharedMetadata(xhs, "Xiaohongshu");
validateSharedMetadata(douyin, "Douyin");
pass("shared metadata keys enums IDs and references");

if (!exactKeys(gated.task_output, [])) fail("approval response task_output");
if (!gated.display_text.includes("Master Approval")) {
  fail("approval response Display Text");
}
if (!gated.confirmation_items.some((item) =>
  item.confirmation_type === "approval" &&
  item.blocking === true &&
  item.prompt.includes("Master Approval")
)) {
  fail("approval response confirmation");
}
pass("missing Master Approval non-generative response");

const commonKeys = [
  "id",
  "platform",
  "source_content_master",
  "preservation_summary",
  "applied_voice_rule_ids",
  "platform_package",
  "source_reference_ids",
];
const validateCommon = (response, platform) => {
  if (!exactKeys(response.task_output, ["platform_version"])) {
    fail(`${platform} task_output keys`);
  }
  const version = response.task_output.platform_version;
  if (!exactKeys(version, commonKeys)) fail(`${platform} Platform Version keys`);
  if (!nonempty(version.id) || version.platform !== platform) {
    fail(`${platform} Platform Version identity`);
  }
  if (!exactKeys(version.source_content_master, [
    "content_master_id",
    "title",
    "master_approval_reference",
  ])) {
    fail(`${platform} source Content Master keys`);
  }
  if (!Object.values(version.source_content_master).every(nonempty)) {
    fail(`${platform} source Content Master values`);
  }
  if (!exactKeys(version.preservation_summary, [
    "target_audience",
    "core_question",
    "creator_position",
    "professional_claim_ids",
    "required_expressions",
    "prohibited_expressions",
  ])) {
    fail(`${platform} preservation keys`);
  }
  for (const key of ["target_audience", "core_question", "creator_position"]) {
    if (!nonempty(version.preservation_summary[key])) {
      fail(`${platform} preservation ${key}`);
    }
  }
  for (const key of [
    "professional_claim_ids",
    "required_expressions",
    "prohibited_expressions",
  ]) {
    if (
      !Array.isArray(version.preservation_summary[key]) ||
      version.preservation_summary[key].length === 0 ||
      version.preservation_summary[key].some((item) => !nonempty(item))
    ) {
      fail(`${platform} preservation ${key}`);
    }
  }
  if (
    !Array.isArray(version.applied_voice_rule_ids) ||
    version.applied_voice_rule_ids.length === 0 ||
    version.applied_voice_rule_ids.some((item) => !nonempty(item)) ||
    !Array.isArray(version.source_reference_ids) ||
    version.source_reference_ids.length === 0
  ) {
    fail(`${platform} voice rules or source references`);
  }
  const sourceIds = new Set(response.source_references.map((item) => item.id));
  if (version.source_reference_ids.some((id) => !sourceIds.has(id))) {
    fail(`${platform} unknown source reference`);
  }
  if (!response.confirmation_items.some((item) =>
    item.confirmation_type === "approval" &&
    item.blocking === true &&
    item.prompt.includes("Platform Approval") &&
    item.prompt.toLowerCase().includes(platform)
  )) {
    fail(`${platform} Platform Approval confirmation`);
  }
  for (const value of [
    version.source_content_master.title,
    version.preservation_summary.target_audience,
    version.preservation_summary.core_question,
    version.preservation_summary.creator_position,
    ...version.preservation_summary.required_expressions,
    ...version.preservation_summary.prohibited_expressions,
  ]) {
    if (!response.display_text.includes(value)) {
      fail(`${platform} Display Text preservation content`);
    }
  }
  return version;
};
const xhsVersion = validateCommon(xhs, "xiaohongshu");
const douyinVersion = validateCommon(douyin, "douyin");
pass("common Platform Version shape and preservation");

const xhsPackage = xhsVersion.platform_package;
if (!exactKeys(xhsPackage, [
  "title_candidates",
  "cover_text",
  "card_pages",
  "caption",
  "hashtags",
  "spoken_script",
])) {
  fail("Xiaohongshu Package keys");
}
if (
  !Array.isArray(xhsPackage.title_candidates) ||
  xhsPackage.title_candidates.length < 1 ||
  xhsPackage.title_candidates.some((item) => !nonempty(item)) ||
  !nonempty(xhsPackage.cover_text) ||
  !Array.isArray(xhsPackage.card_pages) ||
  xhsPackage.card_pages.length < 1 ||
  !nonempty(xhsPackage.caption) ||
  !Array.isArray(xhsPackage.hashtags) ||
  xhsPackage.hashtags.length === 0 ||
  xhsPackage.hashtags.some((item) => !nonempty(item)) ||
  typeof xhsPackage.spoken_script !== "string"
) {
  fail("Xiaohongshu Package values");
}
for (const page of xhsPackage.card_pages) {
  if (!exactKeys(page, [
    "page_number",
    "purpose",
    "text",
    "professional_claim_ids",
  ])) {
    fail("Xiaohongshu card page keys");
  }
  if (
    !Number.isInteger(page.page_number) ||
    !nonempty(page.purpose) ||
    !nonempty(page.text) ||
    !Array.isArray(page.professional_claim_ids) ||
    page.professional_claim_ids.some(
      (id) => !xhsVersion.preservation_summary.professional_claim_ids.includes(id),
    )
  ) {
    fail("Xiaohongshu card page values");
  }
}
for (const value of [
  ...xhsPackage.title_candidates,
  xhsPackage.cover_text,
  ...xhsPackage.card_pages.flatMap((item) => [item.purpose, item.text]),
  xhsPackage.caption,
  ...xhsPackage.hashtags,
  ...(xhsPackage.spoken_script ? [xhsPackage.spoken_script] : []),
]) {
  if (!xhs.display_text.includes(value)) {
    fail(`Xiaohongshu Display Text omits package content: ${value}`);
  }
}
for (const key of [
  "opening_hook",
  "shot_list",
  "subtitle_highlights",
  "interaction_prompt",
]) {
  if (Object.hasOwn(xhsPackage, key)) fail(`Douyin field leaked into Xiaohongshu: ${key}`);
}
pass("Xiaohongshu Package and complete Display Text");

const douyinPackage = douyinVersion.platform_package;
if (!exactKeys(douyinPackage, [
  "title",
  "opening_hook",
  "spoken_script",
  "shot_list",
  "subtitle_highlights",
  "interaction_prompt",
])) {
  fail("Douyin Package keys");
}
if (
  !nonempty(douyinPackage.title) ||
  !nonempty(douyinPackage.opening_hook) ||
  !nonempty(douyinPackage.spoken_script) ||
  !Array.isArray(douyinPackage.shot_list) ||
  douyinPackage.shot_list.length < 1 ||
  !Array.isArray(douyinPackage.subtitle_highlights) ||
  douyinPackage.subtitle_highlights.length === 0 ||
  douyinPackage.subtitle_highlights.some((item) => !nonempty(item)) ||
  !nonempty(douyinPackage.interaction_prompt)
) {
  fail("Douyin Package values");
}
for (const shot of douyinPackage.shot_list) {
  if (!exactKeys(shot, [
    "sequence",
    "visual_prompt",
    "narration",
    "subtitle_text",
    "professional_claim_ids",
  ])) {
    fail("Douyin shot keys");
  }
  if (
    !Number.isInteger(shot.sequence) ||
    !nonempty(shot.visual_prompt) ||
    !nonempty(shot.narration) ||
    !nonempty(shot.subtitle_text) ||
    !Array.isArray(shot.professional_claim_ids) ||
    shot.professional_claim_ids.some(
      (id) => !douyinVersion.preservation_summary.professional_claim_ids.includes(id),
    )
  ) {
    fail("Douyin shot values");
  }
}
for (const value of [
  douyinPackage.title,
  douyinPackage.opening_hook,
  douyinPackage.spoken_script,
  ...douyinPackage.shot_list.flatMap((item) => [
    item.visual_prompt,
    item.narration,
    item.subtitle_text,
  ]),
  ...douyinPackage.subtitle_highlights,
  douyinPackage.interaction_prompt,
]) {
  if (!douyin.display_text.includes(value)) {
    fail(`Douyin Display Text omits package content: ${value}`);
  }
}
for (const key of [
  "title_candidates",
  "cover_text",
  "card_pages",
  "caption",
  "hashtags",
]) {
  if (Object.hasOwn(douyinPackage, key)) {
    fail(`Xiaohongshu field leaked into Douyin: ${key}`);
  }
}
pass("Douyin Package and complete Display Text");

if (!xhs.risk_flags.some((item) =>
  item.risk_type === "blocking_content_risk" &&
  item.severity === "blocking" &&
  xhs.display_text.includes(item.description)
)) {
  fail("Blocking Content Risk dual visibility");
}
if (
  !xhs.display_text.includes("Review Draft") ||
  !douyin.display_text.includes("Review Draft") ||
  !xhs.display_text.includes("Publication Approval") ||
  !douyin.display_text.includes("Publication Approval")
) {
  fail("review and publication boundaries");
}
pass("risk visibility and approval boundaries");

console.log("RESULT platform-adaptation-prompt validation: PASS");
