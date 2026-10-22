// The plugin under the real Codex CLI, end to end: installed from this
// checkout with Codex's own `plugin` commands, its hooks fired by Codex itself
// on Codex's own tools — against a scripted model, so every turn is
// deterministic and needs no credentials. Codex never tells the model, or a
// reader of its output, that a hook failed; it just carries on. So beyond what
// each turn should do, every run is held to "no hook failed".
//
// Needs CODEX_BIN (a Codex binary or the npm package's bin/codex.js); without
// it the suite skips. The codex-compat CI job sets it, plus
// TEAMS_REQUIRE_CODEX_LIVE so a missing binary fails.

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { after, before, describe, it } from "node:test";

import { CODEX_BIN, CodexSession, hookOutcomes } from "./support/codex-session.mjs";
import { MockResponsesServer, assistantMessage, customToolCall, messageTexts, shellCall, toolCallOutput } from "./support/mock-responses-server.mjs";
import { COMMAND_SKILL_DIRS, MODEL_LISTED_SKILL_DIRS, PLUGIN_ID, REPOSITORY_ROOT, SKILL_NAMESPACE, skillName } from "./support/skills.mjs";

const LIVE_TIMEOUT_MS = 240_000;
const CODEX_HOOKS = JSON.parse(readFileSync(join(REPOSITORY_ROOT, "hooks", "codex-hooks.json"), "utf-8"));
// What the scripted orchestrator gives the agent it spawns, so the agent's own requests can be told apart.
const SUBAGENT_TASK = "SUBAGENT TASK: build the logout button";

const patch = (...sections) => `*** Begin Patch\n${sections.join("\n")}\n*** End Patch\n`;

/** A reply that calls a tool in one of Codex's namespaces, the way multi-agent v2 offers spawn_agent. */
function namespacedCall(callId, namespace, name, args) {
  return [
    { type: "response.output_item.done", item: { type: "function_call", call_id: callId, namespace: namespace, name: name, arguments: JSON.stringify(args) } },
    ...assistantMessage("").slice(1),
  ];
}

const hasOutput = (request, callId) =>
  request.input.some((item) => (item.type === "function_call_output" || item.type === "custom_tool_call_output") && item.call_id === callId);

function noHookFailed(run) {
  assert.deepEqual(
    hookOutcomes(run.stderr).filter((outcome) => !outcome.endsWith(" Completed")),
    [],
    run.stderr.split("\n").slice(-40).join("\n"),
  );
}

it("has a Codex CLI to run the live suite against", { skip: process.env.TEAMS_REQUIRE_CODEX_LIVE !== "1" }, () => {
  assert.ok(CODEX_BIN, "set CODEX_BIN to the Codex CLI under test");
});

describe("the muggle-ai-teams plugin in a real Codex", { skip: !CODEX_BIN }, () => {
  const model = new MockResponsesServer();
  let session;
  let skills;
  let hooks;
  // The installed plugin root exactly as Codex hands it to the hooks — read off
  // the commands it substituted it into, since a temp dir can be spelled
  // differently on the way (an 8.3 name on Windows, /private on macOS).
  let pluginRoot;

  before(async () => {
    await model.start();
    session = new CodexSession(model);
    session.prepare();
    const appServer = await session.appServer([
      { method: "skills/list", params: { cwds: [session.workspace], forceReload: true } },
      { method: "hooks/list", params: { cwds: [session.workspace] } },
    ]);
    const [skillsList, hooksList] = appServer.responses;
    skills = skillsList.result.data[0];
    hooks = hooksList.result.data[0];
    const sessionStart = hooks.hooks.find((hook) => hook.command.includes("session-start.js"));
    pluginRoot = /"([^"]+)[\\/]hooks[\\/]session-start\.js"/.exec(sessionStart.command)[1];
  }, { timeout: LIVE_TIMEOUT_MS });

  after(async () => {
    await model.stop();
  });

  describe("what Codex loads", () => {
    it("loads every skill and every command skill without a load error, under the plugin's namespace", () => {
      assert.deepEqual(skills.errors, []);
      const loaded = skills.skills.filter((skill) => skill.pluginId === PLUGIN_ID).map((skill) => skill.name);
      const expected = [...MODEL_LISTED_SKILL_DIRS, ...COMMAND_SKILL_DIRS].map((dir) => `${SKILL_NAMESPACE}:${skillName(dir)}`);
      assert.deepEqual([...loaded].sort(), [...expected].sort());
    });

    // Codex drops a whole agents/openai.yaml over one type error — and with it
    // the policy that keeps the command out of the model's list.
    it("reads every command skill's agents/openai.yaml", () => {
      for (const dir of COMMAND_SKILL_DIRS) {
        const name = skillName(dir);
        const skill = skills.skills.find((entry) => entry.name === `${SKILL_NAMESPACE}:${name}`);
        assert.equal(skill?.interface?.displayName, name);
      }
    });

    it("registers every generated hook, none rejected, and runs none until the user trusts them", () => {
      assert.deepEqual(hooks.warnings, []);
      assert.deepEqual(hooks.errors, []);
      const generated = Object.values(CODEX_HOOKS.hooks).flatMap((groups) => groups.flatMap((group) => group.hooks));
      const registered = hooks.hooks.filter((hook) => hook.pluginId === PLUGIN_ID);
      assert.equal(registered.length, generated.length);
      assert.ok(registered.every((hook) => hook.trustStatus === "untrusted"));
    });
  });

  describe("a turn that names the orchestrator command", () => {
    let run;
    let firstRequest;

    before(async () => {
      run = await session.exec("$muggle-ai-teams:muggle-ai-teams add a logout button to the header", (request, index) => {
        if (index === 0) {
          const injected = messageTexts(request, "user").find((text) => text.startsWith("<skill>")) ?? "";
          const skillPath = /<path>([^<]+)<\/path>/.exec(injected)?.[1] ?? "";
          return shellCall("read-command", `cat '${resolve(dirname(skillPath), "..", "..", "..", "commands", "muggle-ai-teams.md")}'`);
        }
        const command = toolCallOutput(request, "read-command");
        return assistantMessage(command.includes("You are the **Orchestrator**") ? "READ THE COMMAND" : `MISSING: ${command}`);
      });
      firstRequest = run.requests[0];
    }, { timeout: LIVE_TIMEOUT_MS });

    it("completes with every hook succeeding", () => {
      assert.equal(run.status, 0, run.stderr);
      noHookFailed(run);
      assert.ok(hookOutcomes(run.stderr).includes("SessionStart Completed"));
    });

    it("opens with the plugin's Codex notes and its always-on rules", () => {
      const context = messageTexts(firstRequest, "developer").find((text) => text.includes("muggle-ai-teams is running inside Codex"));
      assert.ok(context, "no session-start context");
      assert.ok(context.includes(`The plugin is at ${pluginRoot}.`));
      assert.ok(context.includes('<rule file="rules/behavior.md">'));
      assert.ok(context.includes(`- ${join(pluginRoot, "rules", "coding.md")}: **/*.ts, **/*.tsx`));
    });

    it("injects the command skill the user named, which leads the model to the command itself", () => {
      const injected = messageTexts(firstRequest, "user").find((text) => text.startsWith("<skill>"));
      assert.match(injected, new RegExp(`<name>${SKILL_NAMESPACE}:muggle-ai-teams</name>`));
      assert.match(run.stdout, /READ THE COMMAND/);
    });

    it("lists every plugin skill to the model by name, and no command", () => {
      const catalog = messageTexts(firstRequest, "developer").find((text) => text.startsWith("<skills_instructions>"));
      assert.doesNotMatch(catalog, /Exceeded skills context budget/);
      const listed = [...catalog.matchAll(new RegExp(`^- ${SKILL_NAMESPACE}:([\\w-]+):`, "gm"))].map(([, name]) => name);
      assert.deepEqual([...listed].sort(), MODEL_LISTED_SKILL_DIRS.map(skillName).sort());
    });
  });

  // Each hook keyed on a tool, through Codex's own dispatch on the Codex tool
  // that plays its Claude Code part, with the context it gives reaching the model.
  describe("hooks on Codex's tools", () => {
    let run;
    let lastRequest;

    before(async () => {
      const project = join(session.workspace, "muggle-ai-teams", "projects", "shop");
      mkdirSync(join(project, "tracking"), { recursive: true });
      mkdirSync(join(project, "plans"), { recursive: true });
      writeFileSync(join(project, "tracking", "batch-1.md"), "- [x] Slice 1: header\n- [ ] Slice 2: logout button\n  - [ ] tests pass\n");
      writeFileSync(join(project, "plans", "logout.md"), "# Plan\n\n## Skills Found\n\n| Skill | For |\n|---|---|\n| frontend-patterns | Slice 2 |\n");
      const steps = [
        { id: "read-step", call: () => shellCall("read-step", `cat '${pluginRoot}/workflow/step-2-execute.md'`) },
        { id: "add-doc", call: () => customToolCall("add-doc", "apply_patch", patch("*** Add File: NOTES.md\n+notes")) },
        {
          id: "spawn",
          call: () => namespacedCall("spawn", "collaboration", "spawn_agent", { task_name: "frontend", message: SUBAGENT_TASK, fork_turns: "none" }),
        },
        { id: "wait", call: () => namespacedCall("wait", "collaboration", "wait_agent", { timeout_ms: 10000 }) },
        { id: "commit", call: () => shellCall("commit", "git commit -m 'feat: logout'") },
      ];
      run = await session.exec("build the logout button", (request) => {
        if (messageTexts(request, "user").some((text) => text.includes(SUBAGENT_TASK))) return assistantMessage("frontend done");
        const answered = steps.filter((step) => hasOutput(request, step.id)).length;
        return answered < steps.length ? steps[answered].call() : assistantMessage("all done");
      });
      lastRequest = [...run.requests].reverse().find((request) => hasOutput(request, "commit"));
    }, { timeout: LIVE_TIMEOUT_MS });

    it("completes with every hook succeeding", () => {
      assert.equal(run.status, 0, run.stderr);
      noHookFailed(run);
      assert.ok(lastRequest, "the turn never reached the commit");
    });

    /** The context a hook gave right after (Post) or before (Pre) the call, as Codex placed it. */
    function contextAround(callId, marker) {
      const callIndex = lastRequest.input.findIndex((item) => item.call_id === callId && !item.type.endsWith("_output"));
      const contextIndex = lastRequest.input.findIndex(
        (item) => item.type === "message" && item.role === "developer" && (item.content ?? []).some((part) => (part.text ?? "").includes(marker)),
      );
      assert.ok(contextIndex !== -1, `no context with ${JSON.stringify(marker)}`);
      return { callIndex: callIndex, contextIndex: contextIndex };
    }

    it("injects a workflow step's rules when the shell reads the step file", () => {
      const { callIndex, contextIndex } = contextAround("read-step", "**Batch cap**: Max 5 slices per batch");
      assert.ok(contextIndex > callIndex);
      assert.ok(messageTexts(lastRequest, "developer").some((text) => text.includes("Run /status to check spent so far")));
    });

    it("warns before apply_patch creates a non-standard doc file", () => {
      contextAround("add-doc", "Non-standard documentation file detected");
    });

    it("reminds the orchestrator of the plan's skills before spawn_agent", () => {
      contextAround("spawn", "Skills Found in logout.md");
    });

    it("reminds the orchestrator of the remaining slices before wait_agent", () => {
      contextAround("wait", "[Progress] batch-1.md: 1/2 complete");
    });

    it("warns about unfinished gates before a shell commit", () => {
      contextAround("commit", "Incomplete items detected before commit");
    });
  });
});
