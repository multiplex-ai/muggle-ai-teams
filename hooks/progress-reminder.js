#!/usr/bin/env node
/**
 * Progress Reminder Hook
 *
 * Runs after a sub-agent reports back — Claude Code's Agent call returning,
 * Codex's wait_agent. Scans for tracking files in
 * muggle-ai-teams/projects/<name>/tracking/ and hands the remaining work to the
 * orchestrator as context, to keep it aware of what's left.
 */

const fs = require('fs');
const path = require('path');
const { findFiles, readStdinJson } = require('./lib/utils');
const { emitContext } = require('./lib/host-compat');

function findTrackingFiles() {
  const projectsDir = path.join(process.cwd(), 'muggle-ai-teams', 'projects');
  if (!fs.existsSync(projectsDir)) return [];

  const results = [];
  try {
    const projects = fs.readdirSync(projectsDir, { withFileTypes: true });
    for (const proj of projects) {
      if (!proj.isDirectory()) continue;
      const trackingDir = path.join(projectsDir, proj.name, 'tracking');
      const files = findFiles(trackingDir, '*.md');
      results.push(...files.map(f => f.path));
    }
  } catch {
    // ignore
  }
  return results;
}

function parseTracking(content) {
  const lines = content.split('\n');
  let total = 0;
  let done = 0;
  const remaining = [];

  for (const line of lines) {
    // Match top-level items: "- [ ] Slice 1: ..." or "- [x] Slice 1: ..."
    const match = line.match(/^- \[([ x])\] (.+)/);
    if (match) {
      total++;
      if (match[1] === 'x') {
        done++;
      } else {
        remaining.push(match[2].trim());
      }
    }
  }

  return { total, done, remaining };
}

async function main() {
  const input = await readStdinJson();
  const trackingFiles = findTrackingFiles();
  if (trackingFiles.length === 0) {
    process.exit(0);
  }

  const progress = [];
  for (const filePath of trackingFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { total, done, remaining } = parseTracking(content);

      if (total === 0) continue;
      if (remaining.length === 0) continue;

      const fileName = path.basename(filePath);
      progress.push(`[Progress] ${fileName}: ${done}/${total} complete. Remaining: ${remaining.slice(0, 5).join(', ')}${remaining.length > 5 ? ` (+${remaining.length - 5} more)` : ''}`);
    } catch {
      // ignore unreadable files
    }
  }

  if (progress.length > 0) {
    emitContext(input, progress.join('\n'));
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
