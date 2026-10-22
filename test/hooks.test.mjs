// The hook scripts as each host runs them: Claude Code's tool calls and
// Codex's — apply_patch for edits, shell commands for reads, spawn_agent for
// dispatch — reach the same behaviour, and every answer is one both hosts
// read: context for the model as additionalContext, never stderr, and never
// the payload echoed back, which Codex rejects.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { CODEX_SESSION_START_CONTEXT_TOKENS } from "../scripts/build-codex-plugin.mjs";
import { additionalContext, codexRejection, pathWithFirst, runHook } from "./support/hooks.mjs";
import { REPOSITORY_ROOT } from "./support/skills.mjs";

const WINDOWS = process.platform === "win32";
const scratch = (prefix) => mkdtempSync(join(tmpdir(), `teams-hooks-${prefix}-`));

/** A payload as Claude Code sends it for one tool call. */
function claudeToolPayload(event, toolName, toolInput, cwd) {
  return { session_id: "claude-session", transcript_path: "", cwd: cwd, hook_event_name: event, tool_name: toolName, tool_input: toolInput };
}

/** A payload as Codex 0.163.0 sends it for one tool call (captured from a real run). */
function codexToolPayload(event, toolName, toolInput, cwd) {
  return {
    session_id: "01a1620f-9dd0-7890-b73b-ffb79bba3057",
    turn_id: "01a1620f-9de3-7d41-b1d5-ee5d74d40a1c",
    transcript_path: "",
    cwd: cwd,
    hook_event_name: event,
    model: "gpt-6.1-sol",
    permission_mode: "default",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: "call_1",
  };
}

const patch = (...sections) => `*** Begin Patch\n${sections.join("\n")}\n*** End Patch\n`;

/** Answers as both hosts read them: valid for Codex, and never the payload back. */
function assertAnswerParses(event, run) {
  assert.equal(run.status, 0, run.stderr);
  assert.equal(codexRejection(event, run.stdout), undefined, run.stdout);
}

/** A command on PATH, in `dir`, that runs `script` (a node file) with the arguments it was given. */
function writeFakeCommand(dir, name, script) {
  if (WINDOWS) {
    writeFileSync(join(dir, `${name}.cmd`), `@node "${script}" %*\r\n`);
  } else {
    writeFileSync(join(dir, name), `#!/bin/sh\nexec node "${script}" "$@"\n`);
    chmodSync(join(dir, name), 0o755);
  }
}

describe("post-edit-format.js", () => {
  function prettierProject() {
    const project = scratch("format");
    writeFileSync(join(project, "package.json"), JSON.stringify({ name: "fixture", prettier: {} }));
    const bin = join(project, "node_modules", ".bin");
    mkdirSync(bin, { recursive: true });
    const log = join(project, "prettier-calls.log");
    const fake = join(project, "fake-prettier.mjs");
    writeFileSync(fake, `import { appendFileSync } from "node:fs";\nappendFileSync(${JSON.stringify(log)}, process.argv.slice(2).join(" ") + "\\n");\n`);
    writeFakeCommand(bin, "prettier", fake);
    return { project: project, formatted: () => readFileSync(log, "utf-8").trim().split("\n") };
  }

  it("formats the JS/TS files a Codex patch writes, and no other", () => {
    const { project, formatted } = prettierProject();
    const run = runHook(
      "post-edit-format.js",
      codexToolPayload(
        "PostToolUse",
        "apply_patch",
        {
          command: patch(
            "*** Update File: src/header.tsx\n@@\n-a\n+b",
            "*** Add File: src/menu.js\n+x",
            "*** Add File: docs/notes.md\n+y",
            "*** Delete File: src/old.ts",
            "*** Update File: src/a.ts\n*** Move to: src/b.ts\n@@\n-a\n+b",
          ),
        },
        project,
      ),
      { host: "codex", cwd: project },
    );
    assertAnswerParses("PostToolUse", run);
    assert.equal(run.stdout, "");
    assert.deepEqual(formatted(), [
      `--write ${join(project, "src", "header.tsx")}`,
      `--write ${join(project, "src", "menu.js")}`,
      `--write ${join(project, "src", "b.ts")}`,
    ]);
  });

  it("formats the file a Claude Code Edit names", () => {
    const { project, formatted } = prettierProject();
    const file = join(project, "src", "header.tsx");
    const run = runHook("post-edit-format.js", claudeToolPayload("PostToolUse", "Edit", { file_path: file, old_string: "a", new_string: "b" }, project), {
      cwd: project,
    });
    assertAnswerParses("PostToolUse", run);
    assert.deepEqual(formatted(), [`--write ${file}`]);
  });
});

describe("post-edit-typecheck.js", () => {
  it("hands the model the type errors after a TypeScript edit, in either host", () => {
    const project = scratch("typecheck");
    writeFileSync(join(project, "tsconfig.json"), "{}");
    mkdirSync(join(project, "src"));
    writeFileSync(join(project, "src", "header.ts"), "export const a: number = 'x';\n");
    const fakeBin = scratch("typecheck-bin");
    const fakeTsc = join(fakeBin, "fake-npx.mjs");
    writeFileSync(
      fakeTsc,
      `process.stdout.write("src/header.ts(1,14): error TS2322: Type 'string' is not assignable to type 'number'.\\n");\nprocess.exit(2);\n`,
    );
    writeFakeCommand(fakeBin, "npx", fakeTsc);
    const env = { PATH: pathWithFirst(fakeBin) };

    const codex = runHook(
      "post-edit-typecheck.js",
      codexToolPayload("PostToolUse", "apply_patch", { command: patch("*** Update File: src/header.ts\n@@\n-a\n+b") }, project),
      { host: "codex", cwd: project, env: env },
    );
    assertAnswerParses("PostToolUse", codex);
    assert.match(additionalContext(codex.stdout), /TypeScript errors after editing header\.ts \(1 total\):\nsrc\/header\.ts\(1,14\): error TS2322/);

    const claude = runHook(
      "post-edit-typecheck.js",
      claudeToolPayload("PostToolUse", "Write", { file_path: join(project, "src", "header.ts"), content: "" }, project),
      { cwd: project, env: env },
    );
    assertAnswerParses("PostToolUse", claude);
    assert.match(additionalContext(claude.stdout), /error TS2322/);
  });

  it("says nothing after an edit to a file that is not TypeScript", () => {
    const project = scratch("typecheck-md");
    const run = runHook("post-edit-typecheck.js", codexToolPayload("PostToolUse", "apply_patch", { command: patch("*** Add File: notes.md\n+x") }, project), {
      host: "codex",
      cwd: project,
    });
    assertAnswerParses("PostToolUse", run);
    assert.equal(run.stdout, "");
  });
});

describe("the workflow's tracking hooks", () => {
  function workspaceWithTracking() {
    const workspace = scratch("tracking");
    const project = join(workspace, "muggle-ai-teams", "projects", "shop");
    mkdirSync(join(project, "tracking"), { recursive: true });
    mkdirSync(join(project, "plans"), { recursive: true });
    writeFileSync(
      join(project, "tracking", "batch-1.md"),
      "- [x] Slice 1: header\n- [ ] Slice 2: logout button\n  - [ ] tests pass\n",
    );
    writeFileSync(
      join(project, "plans", "logout.md"),
      "# Plan\n\n## Skills Found\n\n| Skill | For |\n|---|---|\n| frontend-patterns | Slice 2 |\n\n## Slices\n",
    );
    return workspace;
  }

  it("reminds the orchestrator of the remaining slices when an agent reports back", () => {
    const workspace = workspaceWithTracking();
    const claude = runHook("progress-reminder.js", claudeToolPayload("PostToolUse", "Agent", { description: "build", prompt: "go" }, workspace), {
      cwd: workspace,
    });
    assertAnswerParses("PostToolUse", claude);
    assert.equal(additionalContext(claude.stdout), "[Progress] batch-1.md: 1/2 complete. Remaining: Slice 2: logout button");

    // Codex runs it before wait_agent, the call that collects what agents report.
    const codex = runHook("progress-reminder.js", codexToolPayload("PreToolUse", "collaborationwait_agent", { timeout_ms: 30000 }, workspace), {
      host: "codex",
      cwd: workspace,
    });
    assertAnswerParses("PreToolUse", codex);
    assert.equal(additionalContext(codex.stdout), additionalContext(claude.stdout));
  });

  it("reminds the orchestrator of the plan's skills before it dispatches an agent", () => {
    const workspace = workspaceWithTracking();
    const procedure = join(REPOSITORY_ROOT, "workflow", "procedure-agent-dispatch.md");
    for (const [host, payload] of [
      ["claude-code", claudeToolPayload("PreToolUse", "Agent", { subagent_type: "frontend-engineer", prompt: "go" }, workspace)],
      ["codex", codexToolPayload("PreToolUse", "collaborationspawn_agent", { task_name: "frontend", message: "go" }, workspace)],
    ]) {
      const run = runHook("dispatch-skill-reminder.js", payload, { host: host, cwd: workspace });
      assertAnswerParses("PreToolUse", run);
      const context = additionalContext(run.stdout);
      assert.match(context, /Skills Found in logout\.md:\n## Skills Found\n\| Skill \| For \|/, host);
      assert.ok(context.endsWith(`include full text in agent prompt. See ${procedure}`), host);
    }
  });

  it("warns about unfinished gates before a commit, and only a commit", () => {
    const workspace = workspaceWithTracking();
    for (const host of ["claude-code", "codex"]) {
      const payload = (command) =>
        (host === "codex" ? codexToolPayload : claudeToolPayload)("PreToolUse", "Bash", { command: command }, workspace);
      const commit = runHook("batch-completion-check.js", payload("git add -A && git commit -m 'feat: logout'"), { host: host, cwd: workspace });
      assertAnswerParses("PreToolUse", commit);
      assert.match(additionalContext(commit.stdout), /Incomplete items detected before commit:\n {2}batch-1\.md:\n {4}- Slice 2: logout button: tests pass NOT done/);

      const status = runHook("batch-completion-check.js", payload("git status"), { host: host, cwd: workspace });
      assert.equal(status.stdout, "", host);
    }
  });
});

describe("step-context-injector.js", () => {
  const stepFile = join(REPOSITORY_ROOT, "workflow", "step-2-execute.md");

  it("injects a step's rules when Claude Code reads the step file", () => {
    const run = runHook("step-context-injector.js", claudeToolPayload("PostToolUse", "Read", { file_path: stepFile }, REPOSITORY_ROOT));
    assertAnswerParses("PostToolUse", run);
    const context = additionalContext(run.stdout);
    assert.match(context, /^## Injected Rules \(auto-loaded\)/);
    assert.match(context, /\*\*Batch cap\*\*: Max 5 slices per batch/);
    assert.match(context, /Run \/cost to check spent so far/);
  });

  it("injects the same rules when a Codex shell command reads it, naming Codex's usage command", () => {
    for (const command of [`sed -n '1,200p' '${stepFile}'`, `cat muggle-ai-teams/workflow/step-2-execute.md`, `Get-Content -Raw '${stepFile}'`]) {
      const run = runHook("step-context-injector.js", codexToolPayload("PostToolUse", "Bash", { command: command }, REPOSITORY_ROOT), { host: "codex" });
      assertAnswerParses("PostToolUse", run);
      const context = additionalContext(run.stdout);
      assert.match(context, /\*\*Batch cap\*\*: Max 5 slices per batch/, command);
      assert.match(context, /Run \/status to check spent so far/, command);
    }
  });

  it("says nothing for a shell command that reads no step file", () => {
    const run = runHook("step-context-injector.js", codexToolPayload("PostToolUse", "Bash", { command: "git commit -m 'step-2 done'" }, REPOSITORY_ROOT), {
      host: "codex",
    });
    assert.equal(run.stdout, "");
  });
});

describe("doc-file-warning.js", () => {
  it("warns before a new non-standard doc file in either host, and not before a standard one", () => {
    const workspace = scratch("docs");
    const claude = runHook("doc-file-warning.js", claudeToolPayload("PreToolUse", "Write", { file_path: join(workspace, "NOTES.md"), content: "x" }, workspace));
    assertAnswerParses("PreToolUse", claude);
    assert.match(additionalContext(claude.stdout), /Non-standard documentation file detected\n\[Hook\] File: .*NOTES\.md/);

    const codex = runHook(
      "doc-file-warning.js",
      codexToolPayload("PreToolUse", "apply_patch", { command: patch("*** Add File: NOTES.md\n+x", "*** Add File: README.md\n+y", "*** Update File: CHANGES.md\n@@\n-a\n+b") }, workspace),
      { host: "codex" },
    );
    assertAnswerParses("PreToolUse", codex);
    const context = additionalContext(codex.stdout);
    assert.match(context, new RegExp(`\\[Hook\\] File: ${join(workspace, "NOTES.md").replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}`));
    assert.doesNotMatch(context, /File: .*(README|CHANGES)/);
  });
});

describe("the Stop hooks", () => {
  const stopPayload = (cwd) => ({ session_id: "s-1", transcript_path: "", cwd: cwd, hook_event_name: "Stop", stop_hook_active: false, last_assistant_message: "done" });

  it("check-console-log.js shows the user a warning, and never echoes the payload", () => {
    const repo = scratch("console");
    const git = (...args) => execFileSync("git", ["-c", "user.email=t@example.com", "-c", "user.name=t", ...args], { cwd: repo, stdio: "pipe" });
    git("init", "-q");
    writeFileSync(join(repo, "app.js"), "export const a = 1;\n");
    git("add", "app.js");
    git("commit", "-qm", "init");
    writeFileSync(join(repo, "app.js"), "export const a = 1;\nconsole.log(a);\n");
    for (const host of ["claude-code", "codex"]) {
      const run = runHook("check-console-log.js", stopPayload(repo), { host: host, cwd: repo });
      assertAnswerParses("Stop", run);
      assert.match(JSON.parse(run.stdout).systemMessage, /console\.log found in app\.js/, host);
    }
  });

  it("suggest-compact.js counts each session apart, by the id in the payload", () => {
    const run = runHook("suggest-compact.js", { ...stopPayload(REPOSITORY_ROOT), session_id: `count-${Date.now()}` }, {
      host: "codex",
      env: { COMPACT_THRESHOLD: "1" },
    });
    assertAnswerParses("Stop", run);
    assert.match(JSON.parse(run.stdout).systemMessage, /consider \/compact/);
  });

  it("cost-tracker.js records the payload's session and model, and answers nothing", () => {
    const home = scratch("cost-home");
    const run = runHook("cost-tracker.js", { ...stopPayload(REPOSITORY_ROOT), model: "gpt-6.1-sol" }, {
      host: "codex",
      env: { HOME: home, USERPROFILE: home },
    });
    assertAnswerParses("Stop", run);
    assert.equal(run.stdout, "");
    const row = JSON.parse(readFileSync(join(home, ".claude", "metrics", "costs.jsonl"), "utf-8"));
    assert.equal(row.session_id, "s-1");
    assert.equal(row.model, "gpt-6.1-sol");
  });

  it("session-end.js summarizes a Codex rollout: the user's words, the tools, the files a patch wrote", () => {
    const home = scratch("session-home");
    const rollout = join(scratch("rollout"), "rollout.jsonl");
    const lines = [
      { type: "session_meta", payload: { id: "01a1620f", cwd: REPOSITORY_ROOT } },
      { type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "<environment_context>…</environment_context>" }] } },
      { type: "event_msg", payload: { type: "item_completed", item: { type: "UserMessage", content: [{ type: "text", text: "add a logout button" }] } } },
      { type: "response_item", payload: { type: "function_call", name: "exec_command", arguments: JSON.stringify({ cmd: "ls" }) } },
      { type: "response_item", payload: { type: "custom_tool_call", name: "apply_patch", input: patch("*** Update File: src/header.tsx\n@@\n-a\n+b") } },
    ];
    writeFileSync(rollout, `${lines.map((line) => JSON.stringify(line)).join("\n")}\n`);
    const run = runHook("session-end.js", { ...stopPayload(REPOSITORY_ROOT), transcript_path: rollout }, {
      host: "codex",
      env: { HOME: home, USERPROFILE: home },
    });
    assertAnswerParses("Stop", run);
    const sessions = join(home, ".claude", "sessions");
    const [file] = readdirSync(sessions).filter((name) => name.endsWith("-session.tmp"));
    const summary = readFileSync(join(sessions, file), "utf-8");
    assert.match(summary, /### Tasks\n- add a logout button\n/);
    assert.doesNotMatch(summary, /environment_context/);
    assert.match(summary, /### Files Modified\n- src\/header\.tsx\n/);
    assert.match(summary, /### Tools Used\nexec_command, apply_patch/);
  });
});

describe("session-start.js", () => {
  const startPayload = { session_id: "s-1", transcript_path: "", cwd: REPOSITORY_ROOT, hook_event_name: "SessionStart", source: "startup" };

  it("gives a Codex session the plugin's whereabouts, the host equivalents, and every always-on rule", () => {
    const home = scratch("start-home");
    const run = runHook("session-start.js", startPayload, { host: "codex", env: { HOME: home, USERPROFILE: home } });
    assertAnswerParses("SessionStart", run);
    assert.match(run.stdout, /^muggle-ai-teams is running inside Codex/);
    assert.ok(run.stdout.includes(join(REPOSITORY_ROOT, "codex", "host-tool-equivalents.md")));
    for (const rule of readdirSync(join(REPOSITORY_ROOT, "rules"))) {
      const scoped = readFileSync(join(REPOSITORY_ROOT, "rules", rule), "utf-8").startsWith("---");
      if (scoped) assert.ok(run.stdout.includes(`- ${join(REPOSITORY_ROOT, "rules", rule)}: `), rule);
      else assert.ok(run.stdout.includes(`<rule file="rules/${rule}">`), rule);
    }
  });

  // Past its limit Codex spills the context to a file and shows the model only its ends, cutting
  // the rules short. A fifth of the limit is left for the previous session's summary.
  it("fits the Codex context within the limit codex-hooks.json sets, with room for a session summary", () => {
    const home = scratch("start-home-size");
    const run = runHook("session-start.js", startPayload, { host: "codex", env: { HOME: home, USERPROFILE: home } });
    const tokens = Math.ceil(Buffer.byteLength(run.stdout) / 4);
    assert.ok(tokens <= CODEX_SESSION_START_CONTEXT_TOKENS * 0.8, `${tokens} tokens`);
  });

  it("adds nothing for Claude Code, which loads the rules itself", () => {
    const home = scratch("start-home-claude");
    const run = runHook("session-start.js", startPayload, { env: { HOME: home, USERPROFILE: home } });
    assert.equal(run.status, 0);
    assert.equal(run.stdout, "");
  });
});
