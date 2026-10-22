#!/usr/bin/env node
/**
 * Dispatch Skill Reminder Hook (PreToolUse: Claude Code's Agent, Codex's spawn_agent)
 *
 * Fires before a sub-agent is dispatched. Scans plan documents for
 * a Skills Found table and hands the model a reminder to include skill
 * text in the agent dispatch prompt.
 */

const fs = require('fs');
const path = require('path');
const { findFiles, readFile, readStdinJson } = require('./lib/utils');
const { emitContext, pluginRoot } = require('./lib/host-compat');

function findPlanFiles() {
  const projectsDir = path.join(process.cwd(), 'muggle-ai-teams', 'projects');
  if (!fs.existsSync(projectsDir)) return [];

  const results = [];
  try {
    const projects = fs.readdirSync(projectsDir, { withFileTypes: true });
    for (const proj of projects) {
      if (!proj.isDirectory()) continue;
      const plansDir = path.join(projectsDir, proj.name, 'plans');
      const files = findFiles(plansDir, '*.md');
      results.push(...files);
    }
  } catch {
    // ignore
  }
  // Already sorted newest-first by findFiles
  return results;
}

function extractSkillsTable(content) {
  const lines = content.split('\n');
  let inTable = false;
  let headerFound = false;
  const tableLines = [];

  for (const line of lines) {
    if (/^##\s+Skills Found/i.test(line)) {
      headerFound = true;
      tableLines.push(line);
      continue;
    }
    if (headerFound && !inTable && line.startsWith('|')) {
      inTable = true;
    }
    if (inTable) {
      if (line.startsWith('|')) {
        tableLines.push(line);
      } else if (line.trim() === '') {
        // Blank line after table — stop
        break;
      } else {
        break;
      }
    }
  }

  return tableLines.length > 1 ? tableLines.join('\n') : null;
}

async function main() {
  const input = await readStdinJson();
  const planFiles = findPlanFiles();
  if (planFiles.length === 0) {
    process.exit(0);
  }

  // Check the most recent plan file for a Skills Found table
  const content = readFile(planFiles[0].path);
  if (!content) {
    process.exit(0);
  }

  const table = extractSkillsTable(content);
  const reminder = [];
  if (table) {
    reminder.push(`[Dispatch] Skills Found in ${path.basename(planFiles[0].path)}:`, table, '');
  }

  const procedure = path.join(pluginRoot(), 'workflow', 'procedure-agent-dispatch.md');
  reminder.push(`REMINDER: Read relevant SKILL.md files and include full text in agent prompt. See ${procedure}`);
  emitContext(input, reminder.join('\n'));

  process.exit(0);
}

main().catch(() => process.exit(0));
