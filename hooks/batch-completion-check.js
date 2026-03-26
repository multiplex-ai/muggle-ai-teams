#!/usr/bin/env node
/**
 * Batch Completion Check Hook
 *
 * Runs before git commit. Scans tracking files for incomplete items.
 * Warns (does not block) if items are incomplete — the orchestrator
 * should see this warning and address remaining items.
 */

const fs = require('fs');
const path = require('path');
const { log, findFiles, readStdinJson } = require('./lib/utils');

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

function parseIncompleteGates(content) {
  const lines = content.split('\n');
  const issues = [];
  let currentItem = null;

  for (const line of lines) {
    // Top-level item
    const topMatch = line.match(/^- \[([ x])\] (.+)/);
    if (topMatch) {
      currentItem = topMatch[2].trim();
      continue;
    }

    // Sub-item (gate) under current item
    const subMatch = line.match(/^\s+- \[ \] (.+)/);
    if (subMatch && currentItem) {
      issues.push(`${currentItem}: ${subMatch[1].trim()} NOT done`);
    }
  }

  return issues;
}

async function main() {
  const trackingFiles = findTrackingFiles();
  if (trackingFiles.length === 0) {
    process.exit(0);
  }

  const allIssues = [];

  for (const filePath of trackingFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = parseIncompleteGates(content);
      if (issues.length > 0) {
        const fileName = path.basename(filePath);
        allIssues.push({ file: fileName, issues });
      }
    } catch {
      // ignore
    }
  }

  if (allIssues.length > 0) {
    log('[BatchCheck] WARNING: Incomplete items detected before commit:');
    for (const { file, issues } of allIssues) {
      log(`  ${file}:`);
      for (const issue of issues.slice(0, 8)) {
        log(`    - ${issue}`);
      }
      if (issues.length > 8) {
        log(`    ... and ${issues.length - 8} more`);
      }
    }
    log('[BatchCheck] Review tracking files before proceeding.');
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
