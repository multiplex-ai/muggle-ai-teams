// A throwaway Codex install with the plugin added from this checkout the way a
// user adds it, pointed at a scripted model. Everything Codex and the hooks
// write lands in temp dirs: CODEX_HOME for Codex, HOME for the hooks' session
// notes, and a workspace the turns run in.

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

import { PLUGIN_ID, REPOSITORY_ROOT } from "./skills.mjs";

/** The Codex CLI under test — a native binary or the npm package's bin/codex.js. Unset, the live suite skips. */
export const CODEX_BIN = process.env.CODEX_BIN;

/** A model slug no bundled catalog entry prefix-matches, described by the catalog the session writes. */
const MOCK_MODEL = "mock-model";

const CODEX_RUN_TIMEOUT_MS = 180_000;

// Variables that would authenticate Codex against a real backend instead of the mock.
const CREDENTIAL_ENV = ["CODEX_API_KEY", "CODEX_ACCESS_TOKEN", "OPENAI_API_KEY"];

export function codexCommand(args) {
  if (!CODEX_BIN) throw new Error("CODEX_BIN is not set");
  return /\.m?js$/.test(CODEX_BIN) ? { program: process.execPath, argv: [CODEX_BIN, ...args] } : { program: CODEX_BIN, argv: args };
}

/** One isolated Codex home with the plugin installed, and the dirs around it. */
export class CodexSession {
  codexHome = mkdtempSync(join(tmpdir(), "teams-codex-home-"));
  home = mkdtempSync(join(tmpdir(), "teams-codex-user-"));
  workspace = mkdtempSync(join(tmpdir(), "teams-codex-work-"));

  constructor(model) {
    this.model = model;
  }

  /** Install the plugin from this checkout with the user's two commands, and point Codex at the scripted model. */
  prepare() {
    this.runCodex(["plugin", "marketplace", "add", REPOSITORY_ROOT]);
    this.runCodex(["plugin", "add", PLUGIN_ID]);
    this.#writeModelConfig();
  }

  /** The environment every Codex process here runs with — inherited by its hooks. */
  env() {
    const env = { ...process.env };
    for (const name of CREDENTIAL_ENV) delete env[name];
    return { ...env, CODEX_HOME: this.codexHome, HOME: this.home, USERPROFILE: this.home };
  }

  /** Run a Codex subcommand to completion; throws with its output when it fails. */
  runCodex(args) {
    const { program, argv } = codexCommand(args);
    const run = spawnSync(program, argv, {
      cwd: this.workspace,
      env: this.env(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: CODEX_RUN_TIMEOUT_MS,
    });
    if (run.status !== 0) throw new Error(`codex ${args.join(" ")} exited ${run.status}\n${run.stdout}\n${run.stderr}`);
    return run;
  }

  /**
   * One non-interactive turn against the scripted model. Hook trust is
   * bypassed — a test cannot answer Codex's trust prompt — and the sandbox is
   * off, so a runner without user namespaces still executes the commands.
   */
  async exec(prompt, script) {
    this.model.useScript(script);
    const { program, argv } = codexCommand([
      "exec",
      "--skip-git-repo-check",
      "--ephemeral",
      "--dangerously-bypass-hook-trust",
      "--sandbox",
      "danger-full-access",
      "--color",
      "never",
      prompt,
    ]);
    const run = await runToCompletion(program, argv, { cwd: this.workspace, env: this.env() });
    return { ...run, requests: [...this.model.requests] };
  }

  /** Ask `codex app-server` each method in turn over stdio JSON-RPC, after the initialize handshake. */
  async appServer(calls) {
    const { program, argv } = codexCommand(["app-server"]);
    const child = spawn(program, argv, { cwd: this.workspace, env: this.env(), stdio: ["pipe", "pipe", "pipe"] });
    let log = "";
    child.stderr.on("data", (chunk) => (log += chunk.toString("utf-8")));
    const pending = new Map();
    createInterface({ input: child.stdout }).on("line", (line) => {
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        return;
      }
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    });
    let nextId = 0;
    const request = (method, params) =>
      new Promise((resolve) => {
        nextId += 1;
        pending.set(nextId, resolve);
        child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: nextId, method: method, params: params })}\n`);
      });
    const timer = setTimeout(() => child.kill("SIGKILL"), CODEX_RUN_TIMEOUT_MS);
    try {
      await request("initialize", { clientInfo: { name: "teams-codex-live", title: "teams-codex-live", version: "0.0.0" } });
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "initialized" })}\n`);
      const responses = [];
      for (const call of calls) responses.push(await request(call.method, call.params));
      return { responses: responses, log: log };
    } finally {
      clearTimeout(timer);
      child.kill();
    }
  }

  // Top-level keys must precede the tables `codex plugin add` already wrote.
  #writeModelConfig() {
    const catalog = join(this.codexHome, "mock-model-catalog.json");
    writeFileSync(
      catalog,
      JSON.stringify({
        models: [
          {
            slug: MOCK_MODEL,
            display_name: "Mock Model",
            supported_reasoning_levels: [],
            shell_type: "unified_exec",
            visibility: "list",
            supported_in_api: true,
            priority: 1,
            support_verbosity: false,
            truncation_policy: { mode: "bytes", limit: 10000 },
            experimental_supported_tools: [],
            // Offered the tools the bundled models get: apply_patch, and multi-agent v2's spawn_agent.
            apply_patch_tool_type: "freeform",
            multi_agent_version: "v2",
            // A bundled model's window, so the skills list gets a production-sized budget.
            context_window: 272000,
            supports_reasoning_summary_parameter: false,
            base_instructions: "You are a scripted test agent.",
          },
        ],
      }),
    );
    const configPath = join(this.codexHome, "config.toml");
    const installed = readFileSync(configPath, "utf-8");
    const topLevel = [
      `model = "${MOCK_MODEL}"`,
      `model_provider = "mock"`,
      `model_catalog_json = ${JSON.stringify(catalog)}`,
      `web_search = "disabled"`,
    ].join("\n");
    const tables = [
      `[model_providers.mock]`,
      `name = "Scripted model"`,
      `base_url = ${JSON.stringify(this.model.baseUrl)}`,
      `wire_api = "responses"`,
      `supports_websockets = false`,
      `request_max_retries = 0`,
      `stream_max_retries = 0`,
      `stream_idle_timeout_ms = 60000`,
      ``,
      `[analytics]`,
      `enabled = false`,
    ].join("\n");
    writeFileSync(configPath, `${topLevel}\n\n${installed}\n${tables}\n`);
  }
}

/**
 * Run a process to its exit without blocking the event loop — the scripted
 * model answers on it, so a synchronous spawn of Codex would wait on a reply it
 * is itself holding up.
 */
export async function runToCompletion(program, args, options) {
  const child = spawn(program, args, { cwd: options.cwd, env: options.env, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => (stdout += chunk.toString("utf-8")));
  child.stderr.on("data", (chunk) => (stderr += chunk.toString("utf-8")));
  const timer = setTimeout(() => child.kill("SIGKILL"), CODEX_RUN_TIMEOUT_MS);
  const status = await new Promise((resolve) => child.on("close", resolve));
  clearTimeout(timer);
  return { status: status, stdout: stdout, stderr: stderr };
}

/** Hook outcomes Codex prints to stderr in its human output mode, e.g. `hook: Stop Completed`. */
export function hookOutcomes(stderr) {
  return [...stderr.matchAll(/^hook: (\w+) (\w+)/gm)].map(([, event, outcome]) => `${event} ${outcome}`);
}
