#!/usr/bin/env ruby

require "yaml"
require "pathname"

skill_dir = Pathname.new(ARGV.fetch(0, File.expand_path("..", __dir__))).expand_path
fail_check = ->(message) { raise message }
pass_check = ->(message) { puts "PASS #{message}" }

skill_md = skill_dir.join("SKILL.md")
fail_check.call("SKILL.md not found") unless skill_md.file?
content = skill_md.read
match = content.match(/\A---\n(.*?)\n---\n/m)
fail_check.call("invalid YAML frontmatter boundary") unless match
frontmatter = YAML.safe_load(match[1], permitted_classes: [], aliases: false)
fail_check.call("frontmatter must be a mapping") unless frontmatter.is_a?(Hash)
fail_check.call("frontmatter keys must be name and description") unless frontmatter.keys.sort == %w[description name]

name = frontmatter["name"]
description = frontmatter["description"]
fail_check.call("invalid skill name") unless name.is_a?(String) &&
  name.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/) &&
  name.length <= 64 &&
  name == skill_dir.basename.to_s
fail_check.call("invalid description") unless description.is_a?(String) &&
  !description.empty? &&
  description.length <= 1024 &&
  !description.match?(/[<>]/)
pass_check.call("SKILL.md frontmatter and directory name")

allowed_entries = %w[SKILL.md agents references scripts]
unexpected = skill_dir.children.map { |item| item.basename.to_s } - allowed_entries
fail_check.call("unexpected Skill entries: #{unexpected.join(', ')}") unless unexpected.empty?
%w[agents references scripts].each do |directory|
  fail_check.call("missing #{directory}/") unless skill_dir.join(directory).directory?
end
pass_check.call("minimal Skill directory layout")

links = content.scan(/\[[^\]]+\]\(([^)]+)\)/).flatten
fail_check.call("SKILL.md must link required references") unless links.sort == [
  "references/project-sources.md",
  "references/validation-and-review.md",
]
links.each do |relative|
  fail_check.call("broken Skill link: #{relative}") unless skill_dir.join(relative).file?
end
pass_check.call("direct reference links resolve")

openai_yaml = skill_dir.join("agents", "openai.yaml")
fail_check.call("agents/openai.yaml not found") unless openai_yaml.file?
agent = YAML.safe_load(openai_yaml.read, permitted_classes: [], aliases: false)
interface = agent.fetch("interface")
fail_check.call("unexpected openai.yaml keys") unless interface.keys.sort == %w[
  default_prompt
  display_name
  short_description
]
interface.each_value do |value|
  fail_check.call("openai.yaml interface values must be strings") unless value.is_a?(String)
end
short_description = interface.fetch("short_description")
fail_check.call("short_description length") unless (25..64).cover?(short_description.length)
fail_check.call("default_prompt must mention $#{name}") unless interface.fetch("default_prompt").include?("$#{name}")
pass_check.call("agents/openai.yaml interface metadata")

required_scripts = %w[
  validate-base-package.mjs
  validate-content-master-prompt.mjs
  validate-platform-adaptation-prompt.mjs
  validate-skill-structure.rb
  validate-topic-generation-prompt.mjs
]
missing_scripts = required_scripts.reject { |script| skill_dir.join("scripts", script).file? }
fail_check.call("missing scripts: #{missing_scripts.join(', ')}") unless missing_scripts.empty?
pass_check.call("required deterministic validators exist")

puts "RESULT developing-creator-operations-prompts structure: PASS"
