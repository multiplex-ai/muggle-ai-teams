// Codex loads the plugin's skills unchanged, and fails them quietly: a SKILL.md
// that breaks its parser is dropped with nothing but a log line, a description
// that does not fit is cut without a word, and a list that outgrows its budget
// loses skills altogether. Each rule below is Codex 0.163.0's own, from
// codex-rs/skills/src/parser.rs and codex-rs/ext/skills/src/render.rs, pinned
// here rather than discovered by a user whose skill is missing.

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import { findDrift, listCommands } from "../scripts/build-codex-plugin.mjs";
import {
  COMMAND_SKILL_DIRS,
  MODEL_LISTED_SKILL_DIRS,
  SKILL_DIRS,
  SKILL_NAMESPACE,
  SKILL_ROOTS,
  frontmatter,
  frontmatterValue,
  skillMarkdown,
  skillName,
} from "./support/skills.mjs";

const CODEX_MAX_SKILL_NAME_LENGTH = 64;
// A longer description is cut to 1,021 characters and "...".
const CODEX_MAX_SKILL_DESCRIPTION_LENGTH = 1024;
// What a `$muggle-ai-teams:<name>` mention can spell; the mention ends at any other character.
const CODEX_MENTIONABLE_NAME = /^[A-Za-z0-9_-]+$/;
// The skills list's budget is 2% of the model's context window (272,000 tokens
// for every bundled model), at a token per 4 bytes of each line. Past it Codex
// trims every description round-robin; once the lines without descriptions no
// longer fit either, it drops skills from the list.
const CODEX_SKILLS_BUDGET_TOKENS = 272_000 * 0.02;
// The plugin's lines, stripped to name and path, keep to this share, so its
// skills are never the ones dropped and the rest leaves room for Codex's own
// skills, the user's, and some description text.
const PLUGIN_SHARE_OF_SKILLS_BUDGET = 2 / 3;

const lineTokens = (line) => Math.ceil(Buffer.byteLength(`${line}\n`) / 4);
const directoryName = (skillDir) => skillDir.split(/[\\/]/).pop();

describe("skills Codex can load", () => {
  it("finds every skill, across the roots the manifest lists", () => {
    assert.ok(MODEL_LISTED_SKILL_DIRS.length >= 150);
    assert.equal(COMMAND_SKILL_DIRS.length, listCommands().length);
  });

  // Codex scans each root recursively and loads every SKILL.md it finds — one at
  // the root itself, or nested in another skill's folders — as one more skill.
  it("keeps every SKILL.md directly in a skill's own directory", () => {
    for (const root of SKILL_ROOTS) {
      const stray = readdirSync(root, { recursive: true })
        .map((entry) => String(entry).split(/[\\/]/))
        .filter((parts) => parts.at(-1) === "SKILL.md" && parts.length !== 2 && !parts.some((part) => part.startsWith(".")));
      assert.deepEqual(stray.map((parts) => parts.join("/")), [], root);
    }
  });

  for (const skillDir of SKILL_DIRS) {
    const label = directoryName(skillDir);

    it(`${label} opens with the frontmatter fence Codex looks for`, () => {
      const markdown = skillMarkdown(skillDir);
      assert.notEqual(markdown.charCodeAt(0), 0xfeff, "a byte-order mark hides the fence");
      assert.equal(markdown.split(/\r?\n/, 1)[0].trim(), "---");
    });

    it(`${label} has a name \`$${SKILL_NAMESPACE}:<name>\` can reach`, () => {
      const name = skillName(skillDir);
      assert.ok(name.length <= CODEX_MAX_SKILL_NAME_LENGTH, name);
      assert.match(name, CODEX_MENTIONABLE_NAME);
    });

    it(`${label} has a description Codex lists whole`, () => {
      const description = frontmatterValue(skillDir, "description") ?? "";
      assert.ok(description.length > 0, "Codex refuses a skill without a description");
      assert.ok(description.length <= CODEX_MAX_SKILL_DESCRIPTION_LENGTH, `${description.length} characters`);
    });

    // `metadata` is the one key Codex types strictly; a scalar there fails the whole skill.
    it(`${label} carries no metadata Codex would reject`, () => {
      assert.doesNotMatch(frontmatter(skillDir), /^metadata:[ \t]*[^\s#]/m);
    });
  }

  it("gives every skill a name of its own, since a mention reaches only one", () => {
    const names = SKILL_DIRS.map(skillName);
    assert.deepEqual(
      names.filter((name, index) => names.indexOf(name) !== index),
      [],
    );
  });

  it("lists every skill to the model by name within the plugin's share of Codex's budget", () => {
    const tokens = MODEL_LISTED_SKILL_DIRS.reduce(
      (total, skillDir) =>
        total + lineTokens(`- ${SKILL_NAMESPACE}:${skillName(skillDir)}: (file: r2/${directoryName(skillDir)}/SKILL.md)`),
      0,
    );
    assert.ok(
      tokens <= CODEX_SKILLS_BUDGET_TOKENS * PLUGIN_SHARE_OF_SKILLS_BUDGET,
      `${tokens} tokens of a ${CODEX_SKILLS_BUDGET_TOKENS}-token budget`,
    );
  });
});

describe("command skills under Codex", () => {
  it("are what scripts/build-codex-plugin.mjs generates from commands/", () => {
    assert.deepEqual(findDrift(), []);
  });

  // Codex's own conversion of commands/ would list a second, partial copy of them to the model.
  it("replace Codex's own conversion of the plugin's commands", () => {
    const manifest = JSON.parse(readFileSync(join(SKILL_ROOTS[0], "..", ".codex-plugin", "plugin.json"), "utf-8"));
    assert.deepEqual(manifest.commands, []);
  });

  for (const skillDir of COMMAND_SKILL_DIRS) {
    const label = directoryName(skillDir);

    it(`${label} is for the user to type, never for Codex to pick on its own`, () => {
      const policy = readFileSync(join(skillDir, "agents", "openai.yaml"), "utf-8");
      // A quoted "false" is a string, and a mistyped field voids the whole file.
      assert.match(policy, /^ {2}allow_implicit_invocation: false\r?$/m);
      assert.match(policy, new RegExp(`^ {2}display_name: "${label}"\\r?$`, "m"));
    });

    it(`${label} points at a command that exists`, () => {
      const command = /`\.\.\/\.\.\/\.\.\/(commands\/[^`]+\.md)`/.exec(skillMarkdown(skillDir))?.[1];
      assert.ok(command, "no command path");
      assert.ok(existsSync(join(skillDir, "..", "..", "..", command)), command);
    });
  }

  it("leave no generated skill behind for a command that is gone", () => {
    const commands = new Set(listCommands().map((command) => command.name));
    const generated = readdirSync(join(SKILL_ROOTS[1]), { withFileTypes: true }).filter((entry) => entry.isDirectory());
    assert.deepEqual(
      generated.map((entry) => entry.name).filter((name) => !commands.has(name)),
      [],
    );
  });
});
