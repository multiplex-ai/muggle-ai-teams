#!/usr/bin/env node
/**
 * Doc file warning hook (PreToolUse - Claude Code's Write, Codex's apply_patch)
 * Warns the model about non-standard documentation files it is about to create.
 * Exit code 0 always (warns only, never blocks).
 */

'use strict';

const path = require('path');
const { emitContext, writtenFilePaths } = require('./lib/host-compat');

const MAX_STDIN = 1024 * 1024;
let data = '';

function isAllowedDocPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const basename = path.basename(filePath);

  if (!/\.(md|txt)$/i.test(filePath)) return true;

  if (/^(README|CLAUDE|AGENTS|CONTRIBUTING|CHANGELOG|LICENSE|SKILL|MEMORY|WORKLOG)\.md$/i.test(basename)) {
    return true;
  }

  if (/\.claude\/(commands|plans|projects)\//.test(normalized)) {
    return true;
  }

  if (/(^|\/)(docs|skills|\.history|memory)\//.test(normalized)) {
    return true;
  }

  if (/\.plan\.md$/i.test(basename)) {
    return true;
  }

  return false;
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', c => {
  if (data.length < MAX_STDIN) {
    const remaining = MAX_STDIN - data.length;
    data += c.substring(0, remaining);
  }
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const nonStandard = writtenFilePaths(input, { createdOnly: true }).filter(filePath => !isAllowedDocPath(filePath));

    if (nonStandard.length > 0) {
      emitContext(input, [
        '[Hook] WARNING: Non-standard documentation file detected',
        ...nonStandard.map(filePath => `[Hook] File: ${filePath}`),
        '[Hook] Consider consolidating into README.md or docs/ directory',
      ].join('\n'));
    }
  } catch {
    // ignore parse errors
  }
});
