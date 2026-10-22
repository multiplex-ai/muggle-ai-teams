// A stand-in for the Responses API, so a real `codex exec` runs against a model
// whose every reply the test writes. Codex parses `data:` payloads by their
// `type`, needs each output item as `response.output_item.done`, and ends a
// reply only on `response.completed` (codex-rs/codex-api/src/sse/responses.rs).

import { createServer } from "node:http";

let completedResponses = 0;

function completed() {
  completedResponses += 1;
  return {
    type: "response.completed",
    response: {
      id: `resp_${completedResponses}`,
      usage: { input_tokens: 0, input_tokens_details: null, output_tokens: 0, output_tokens_details: null, total_tokens: 0 },
    },
  };
}

/** A reply that ends the step with an assistant message. */
export function assistantMessage(text) {
  return [
    { type: "response.output_item.done", item: { type: "message", role: "assistant", content: [{ type: "output_text", text: text }] } },
    completed(),
  ];
}

/** A reply that runs a shell command through Codex's `exec_command` tool. */
export function shellCall(callId, command) {
  return [
    {
      type: "response.output_item.done",
      item: { type: "function_call", call_id: callId, name: "exec_command", arguments: JSON.stringify({ cmd: command }) },
    },
    completed(),
  ];
}

/** A reply that calls one of Codex's own function tools — apply_patch, update_plan, spawn_agent… */
export function functionCall(callId, name, args) {
  return [
    { type: "response.output_item.done", item: { type: "function_call", call_id: callId, name: name, arguments: JSON.stringify(args) } },
    completed(),
  ];
}

/** A reply that calls a freeform (custom) tool, the way Codex offers apply_patch to most models. */
export function customToolCall(callId, name, input) {
  return [
    { type: "response.output_item.done", item: { type: "custom_tool_call", call_id: callId, name: name, input: input } },
    completed(),
  ];
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    request.on("error", reject);
  });
}

/** The scripted model: answers each `POST …/responses` from its script and keeps every request. */
export class MockResponsesServer {
  requests = [];
  #server = undefined;
  #script = () => assistantMessage("done");

  /** The base URL Codex's provider config points at. */
  get baseUrl() {
    const address = this.#server?.address();
    if (!address) throw new Error("mock Responses server is not listening");
    return `http://127.0.0.1:${address.port}/v1`;
  }

  /** Replace the script for the next run, and forget the requests of the last. */
  useScript(script) {
    this.#script = script;
    this.requests.length = 0;
  }

  async start() {
    this.#server = createServer((request, response) => void this.#answer(request, response));
    await new Promise((resolve) => this.#server.listen(0, "127.0.0.1", resolve));
  }

  async stop() {
    await new Promise((resolve) => (this.#server ? this.#server.close(() => resolve()) : resolve()));
  }

  async #answer(request, response) {
    const body = await readBody(request);
    if (request.method !== "POST" || !/\/responses$/.test((request.url ?? "").split("?")[0])) {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: { message: `mock: no route for ${request.method} ${request.url}` } }));
      return;
    }
    const modelRequest = JSON.parse(body);
    const index = this.requests.push(modelRequest) - 1;
    const events = this.#script(modelRequest, index);
    response.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
    response.end(events.map((event) => `event: ${String(event.type)}\ndata: ${JSON.stringify(event)}\n\n`).join(""));
  }
}

/** Every text a request's messages carry for one role, in order. */
export function messageTexts(request, role) {
  return request.input
    .filter((item) => item.type === "message" && item.role === role)
    .flatMap((item) => (item.content ?? []).map((part) => part.text ?? ""));
}

/** The output Codex returned for one tool call. */
export function toolCallOutput(request, callId) {
  const item = request.input.find(
    (entry) => (entry.type === "function_call_output" || entry.type === "custom_tool_call_output") && entry.call_id === callId,
  );
  if (!item) return "";
  return typeof item.output === "string" ? item.output : JSON.stringify(item.output);
}
