# Host Tool Equivalents

muggle-ai-teams' commands, agents, workflow steps and skills are written against Claude Code. In Codex, read each Claude Code name below as the Codex equivalent. Everything they do through the shell, `git`, `gh` and MCP servers works the same in both hosts; only the names in this table change.

The plugin directory is the one that holds this `codex/` folder. Paths the workflow writes as `workflow/…`, `muggle-ai-teams/workflow/…`, `contexts/…`, `rules/…` or `agents/<name>.md` are files there. `muggle-ai-teams/projects/…` — tracking files and plans — stays relative to the working directory, as in Claude Code.

| The instructions say | In Claude Code | In Codex |
| :------------------- | :------------- | :------- |
| A muggle-ai-teams command: `/muggle-ai-teams`, `/plan`, `/save-session`, `/resume-session`, … | A slash command | The skill `$muggle-ai-teams:<command>`, which the user types or picks from `/skills`. When a step tells you to run one, read `commands/<command>.md` and follow it. |
| Dispatch, spawn or "use" an agent (`agents/<name>.md`, the Agent or Task tool, `subagent_type`) | The Agent tool | `spawn_agent`, with that agent file's body as the start of the task message, then the prompt the dispatch procedure builds. Codex does not apply the agent's `model:` or `tools:` — tell a read-only agent (reviewers, planner, architect) in the message to make no edits. Collect results with `wait_agent`. Where `spawn_agent` is not offered, do the agent's work yourself, in its role. |
| `run_in_background`, `TaskOutput` | Run an agent or command in the background, read its output later | `spawn_agent` already runs in the background; `wait_agent` collects it. A long shell command keeps running in its session; poll it with `write_stdin`. |
| `TaskCreate`, `TaskUpdate`, `TodoWrite` | The session task list | `update_plan` where Codex offers it (it does with `[tools.update_plan] enabled = true` in `~/.codex/config.toml`). Otherwise keep the checklist in the tracking file the workflow already writes, and restate it in your replies. |
| `AskUserQuestion` | Clickable options | `request_user_input` where Codex offers it. Otherwise end your turn on the question, with the options numbered, and treat the user's reply as their pick. Never pick for them. |
| `Read`, `Glob`, `Grep` | File tools | The shell: `cat` or `sed -n`, `rg --files`, `rg`. |
| `Write`, `Edit`, `MultiEdit` | File tools | `apply_patch`. |
| `WebSearch`, `WebFetch` | Web tools | Codex's `web_search` tool where it is enabled; `curl` for a page, which needs network access in the sandbox. |
| Plan mode (`EnterPlanMode`, `ExitPlanMode`) | A read-only planning mode | Present the plan in your reply and wait for the user's approval before changing anything. |
| `/compact`, `/cost`, `/clear` | Built-in commands | Ask the user to run `/compact`, `/status` (token usage) or `/new`. You cannot run them yourself in either host. |
| A skill or agent from another plugin: `superpowers:<skill>`, `feature-dev:code-explorer`, `feature-dev:code-architect`, `frontend-design` | Installed Claude Code plugins | Use a Codex install of it where `/skills` lists one; otherwise carry out what the step asks of it yourself. |
| `model:` pins, opus / sonnet / haiku routing | Runs the agent or skill on that model | Ignored. Every agent runs the session's model unless the user asks for another. |
| `CLAUDE.md` | Loaded from each directory | Codex loads `AGENTS.md` instead. Read a repo's `CLAUDE.md` yourself where a step relies on it; `project_doc_fallback_filenames = ["CLAUDE.md"]` in `~/.codex/config.toml` makes Codex load it. |
| `MEMORY.md`, "save to memory" | Claude Code's memory | Codex has no memory store. Read a `MEMORY.md` in the working directory if there is one; record lessons in `rules/` and the other files the learning step names. |
| `~/.claude/rules/` | Loaded every session | Already in your context: the session-start hook gives a Codex session the always-on rules, and names the path-scoped ones. |
| `~/.claude/agents/`, `~/.claude/skills/` to read | The installed agents and skills | The plugin's `agents/` and `skills/`. |
| An agent, skill or rule to edit (the learning step) | The installed copy, which setup links to the muggle-ai-teams checkout | The user's muggle-ai-teams checkout, never the plugin directory: Codex keeps its own copy of the plugin and replaces it on every install or upgrade. With no checkout, ask the user where the change should go. |
| `${CLAUDE_PLUGIN_ROOT}` in a command you run | Set wherever a command runs | Set for hooks only, never in your shell. Set it at the start of the same command that uses it: `CLAUDE_PLUGIN_ROOT='<plugin directory>'; node "${CLAUDE_PLUGIN_ROOT}/…"`. Prefixing it to the command name alone does not work: the shell expands the path before the assignment applies. |
| "The PreToolUse hook will remind you" | Hooks run once the plugin is installed | Hooks run once the user trusts them (`/hooks`). Until then, follow the procedure the reminder names without it. |

## Codex's sandbox

Codex runs your shell commands in a sandbox that, by default, blocks the network and writes outside the workspace. Writes under `~/.claude/` (session notes, learned skills), `gh`, `npx` downloads and `curl` are refused there. When one is, ask for the command to run with escalated permissions rather than working around it. A user who wants fewer prompts can allow them in `~/.codex/config.toml`:

```toml
[sandbox_workspace_write]
network_access = true
writable_roots = ["/absolute/path/to/home/.claude"]
```
