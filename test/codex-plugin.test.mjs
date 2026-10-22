// The Codex plugin's manifests, as Codex 0.163.0 reads them
// (codex-rs/core-plugins/src/manifest.rs and its marketplace loader), and the
// hooks manifest generated for it: what each one has to hold for
// `codex plugin add muggle-ai-teams@muggle-ai-teams` to install the plugin and
// for every hook to fire on the Codex tool that plays its Claude Code part.

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import { CODEX_HOST_ARGUMENT, CODEX_TOOL_EQUIVALENTS, deriveCodexHooks } from "../scripts/build-codex-plugin.mjs";
import { REPOSITORY_ROOT, SKILL_DIRS, SKILL_NAMESPACE, skillName } from "./support/skills.mjs";

const readJson = (path) => JSON.parse(readFileSync(join(REPOSITORY_ROOT, path), "utf-8"));

const manifest = readJson(".codex-plugin/plugin.json");
const marketplace = readJson(".agents/plugins/marketplace.json");
const claudeManifest = readJson(".claude-plugin/plugin.json");
const packageJson = readJson("package.json");
const claudeHooks = readJson("hooks/hooks.json");
const codexHooks = readJson("hooks/codex-hooks.json");

// Codex's limits on the plugin's interface (codex-rs/core-plugins/src/manifest.rs).
const MAX_DEFAULT_PROMPT_COUNT = 3;
const MAX_DEFAULT_PROMPT_LENGTH = 128;
// What Codex names each tool in a hook payload, observed against Codex 0.163.0:
// the shell is Bash, edits are apply_patch, and the multi-agent tools are
// `collaboration<tool>` under v2 while v1 reports spawn_agent bare and wait_agent
// as `multi_agent_v1wait_agent`.
const CODEX_HOOK_TOOL_NAMES = new Set([
  "Bash",
  "apply_patch",
  "collaborationspawn_agent",
  "spawn_agent",
  "collaborationwait_agent",
  "multi_agent_v1wait_agent",
]);

describe("the Codex plugin manifest", () => {
  // `codex plugin add` refuses a plugin whose manifest name differs from its marketplace entry.
  it("is named as the marketplace lists it, which is its Claude Code name", () => {
    assert.equal(manifest.name, marketplace.plugins[0].name);
    assert.equal(manifest.name, claudeManifest.name);
    assert.equal(marketplace.name, manifest.name);
  });

  it("is the version package.json and the Claude Code manifest carry", () => {
    for (const version of [manifest.version, marketplace.plugins[0].version, claudeManifest.version]) {
      assert.equal(version, packageJson.version);
    }
  });

  it("lists the plugin at the marketplace's own root", () => {
    assert.equal(marketplace.plugins.length, 1);
    assert.equal(marketplace.plugins[0].source, "./");
  });

  // Codex ignores a component path that does not start with `./` or is `./` itself.
  it("points every component at a path inside the plugin", () => {
    for (const path of [...manifest.skills, manifest.hooks]) {
      assert.match(path, /^\.\/[^/]/, path);
      assert.ok(existsSync(join(REPOSITORY_ROOT, path)), path);
    }
  });

  it("offers the default prompts Codex shows, each naming a skill the plugin has", () => {
    const prompts = manifest.interface.defaultPrompt;
    assert.ok(prompts.length <= MAX_DEFAULT_PROMPT_COUNT);
    const skills = new Set(SKILL_DIRS.map(skillName));
    for (const prompt of prompts) {
      assert.ok(prompt.length <= MAX_DEFAULT_PROMPT_LENGTH, prompt);
      for (const [, skill] of prompt.matchAll(new RegExp(`\\$${SKILL_NAMESPACE}:([\\w-]+)`, "g"))) {
        assert.ok(skills.has(skill), `${prompt} names no skill ${skill}`);
      }
    }
  });
});

describe("hooks/codex-hooks.json", () => {
  const codexGroups = Object.entries(codexHooks.hooks).flatMap(([event, groups]) => groups.map((group) => ({ event: event, ...group })));
  const codexCommands = codexGroups.flatMap((group) => group.hooks.map((hook) => hook.command));

  it("is what scripts/build-codex-plugin.mjs derives from hooks.json", () => {
    assert.deepEqual(codexHooks, deriveCodexHooks(claudeHooks));
  });

  it("runs every hooks.json command under Codex, told that Codex fired it", () => {
    const claudeCommands = Object.values(claudeHooks.hooks).flatMap((groups) => groups.flatMap((group) => group.hooks.map((hook) => hook.command)));
    assert.deepEqual(
      [...codexCommands].sort(),
      claudeCommands.map((command) => `${command} ${CODEX_HOST_ARGUMENT}`).sort(),
    );
  });

  it("names only tools Codex reports to hooks", () => {
    for (const group of codexGroups) {
      if (group.matcher === undefined) continue;
      for (const tool of group.matcher.split("|")) assert.ok(CODEX_HOOK_TOOL_NAMES.has(tool), `${group.event}: ${tool}`);
    }
  });

  it("maps every tool hooks.json names", () => {
    for (const groups of Object.values(claudeHooks.hooks)) {
      for (const group of groups) {
        for (const tool of group.matcher?.split("|") ?? []) assert.ok(CODEX_TOOL_EQUIVALENTS[tool], tool);
      }
    }
  });

  // A matcher made only of names and `|` is compared whole; anything else is a regex against the tool name.
  it("matches tools by name in both hosts", () => {
    for (const group of [...Object.values(claudeHooks.hooks).flat(), ...codexGroups]) {
      if (group.matcher !== undefined) assert.match(group.matcher, /^[A-Za-z0-9_]+(\|[A-Za-z0-9_]+)*$/, group.matcher);
    }
  });

  it("runs scripts that exist, with the plugin root quoted, within a timeout in seconds", () => {
    for (const group of Object.values(claudeHooks.hooks).flat()) {
      for (const hook of group.hooks) {
        const script = /^node "\$\{CLAUDE_PLUGIN_ROOT\}\/(hooks\/[\w-]+\.js)"$/.exec(hook.command)?.[1];
        assert.ok(script, hook.command);
        assert.ok(existsSync(join(REPOSITORY_ROOT, script)), script);
        assert.ok(hook.timeout > 0 && hook.timeout <= 120, `${script}: ${hook.timeout}`);
      }
    }
  });
});
