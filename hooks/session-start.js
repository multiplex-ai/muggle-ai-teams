#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context on new session
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new Claude session starts. Loads the most recent session
 * summary into Claude's context via stdout, and reports available
 * sessions and learned skills.
 *
 * Under Codex it also gives the model what Claude Code has natively: where the
 * plugin is and how its Claude Code instructions read in Codex, and the
 * always-on rules, which Claude Code loads from ~/.claude/rules and Codex
 * reads nowhere. hooks/codex-hooks.json raises Codex's context limit for this
 * hook to fit them.
 *
 * Adapted for muggle-ai project (removed session-aliases and project-detect deps).
 */

const fs = require('fs');
const path = require('path');
const {
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  readFile,
  log
} = require('./lib/utils');
const { getPackageManager, getSelectionPrompt } = require('./lib/package-manager');
const { hookHost, pluginRoot, writeStdout } = require('./lib/host-compat');

const RULE_FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * The context a Codex session starts with: how to read the plugin's Claude
 * Code instructions, the always-on rules in full, and where each path-scoped
 * rule applies — Codex cannot scope a rule to the files it governs, so the
 * model is told to read it before editing one.
 */
function codexSessionContext() {
  const root = pluginRoot();
  const rulesDir = path.join(root, 'rules');
  const alwaysOnRules = [];
  const pathScopedRules = [];
  for (const file of fs.readdirSync(rulesDir).filter(name => name.endsWith('.md')).sort()) {
    const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
    const frontmatter = RULE_FRONTMATTER.exec(content);
    const globs = frontmatter ? [...frontmatter[1].matchAll(/^\s*-\s*["']?([^"'\r\n]+?)["']?\s*$/gm)].map(match => match[1]) : [];
    if (globs.length > 0) {
      pathScopedRules.push(`- ${path.join(rulesDir, file)}: ${globs.join(', ')}`);
    } else {
      alwaysOnRules.push(`<rule file="rules/${file}">\n${content.trim()}\n</rule>`);
    }
  }
  const equivalents = path.join(root, 'codex', 'host-tool-equivalents.md');
  return [
    [
      `muggle-ai-teams is running inside Codex, and its commands, agents, workflow and skills were written for Claude Code. The plugin is at ${root}.`,
      '- Its slash commands are skills here: /muggle-ai-teams is $muggle-ai-teams:muggle-ai-teams, /plan is $muggle-ai-teams:plan.',
      '- Read `workflow/…`, `muggle-ai-teams/workflow/…`, `contexts/…`, `rules/…` and `agents/<name>.md` from that plugin directory. `muggle-ai-teams/projects/…` — tracking files and plans — stays relative to your working directory.',
      `- For each Claude Code tool they name — the Agent tool, TaskCreate, AskUserQuestion, WebSearch, Read, Edit, Write — and for /compact, /cost and plan mode, use the Codex equivalent in ${equivalents}.`,
    ].join('\n'),
    "muggle-ai-teams' always-on rules follow. Claude Code loads them from ~/.claude/rules; they apply here the same way.",
    ...alwaysOnRules,
    ['These rules apply only to files matching their paths. Read the rule before editing such a file:', ...pathScopedRules].join('\n'),
  ].join('\n\n');
}

async function main() {
  const contextBlocks = hookHost() === 'codex' ? [codexSessionContext()] : [];
  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();

  // Ensure directories exist
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // Check for recent session files (last 7 days)
  const recentSessions = findFiles(sessionsDir, '*-session.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    log(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    log(`[SessionStart] Latest: ${latest.path}`);

    // Read and inject the latest session content into Claude's context
    const content = readFile(latest.path);
    if (content && !content.includes('[Session context goes here]')) {
      // Only inject if the session has actual content (not the blank template)
      contextBlocks.push(`Previous session summary:\n${content}`);
    }
  }

  // Check for learned skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    log(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  if (contextBlocks.length > 0) {
    writeStdout(`${contextBlocks.join('\n\n')}\n`);
  }

  // Detect and report package manager
  const pm = getPackageManager();
  log(`[SessionStart] Package manager: ${pm.name} (${pm.source})`);

  // If no explicit package manager config was found, show selection prompt
  if (pm.source === 'default') {
    log('[SessionStart] No package manager preference found.');
    log(getSelectionPrompt());
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // Don't block on errors
});
