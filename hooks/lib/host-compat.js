/**
 * What differs between the two hosts that run these hooks — Claude Code and
 * Codex — kept in one place, so each hook reads a tool call and answers it the
 * same way under both.
 *
 * Codex runs the hooks from hooks/codex-hooks.json, which
 * scripts/build-codex-plugin.mjs generates from hooks.json. It renames each
 * matcher to the Codex tool that plays the part, and passes `codex` as the
 * hook's last argument: Codex exports CLAUDE_PLUGIN_ROOT to hooks as well, so
 * nothing else tells the hosts apart.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CODEX_HOST_ARGUMENT = 'codex';

// A Codex patch names each file it touches on a header line, and a move on the line after.
const PATCH_FILE_HEADER = /^\*\*\* (Add|Update|Delete) File: (.+)$/;
const PATCH_MOVE_HEADER = /^\*\*\* Move to: (.+)$/;

/**
 * The host that fired this hook.
 * @returns {'codex' | 'claude-code'}
 */
function hookHost() {
  return process.argv.slice(2).includes(CODEX_HOST_ARGUMENT) ? 'codex' : 'claude-code';
}

/**
 * The plugin's directory, as the host spells it: both hosts export
 * CLAUDE_PLUGIN_ROOT to a plugin's hooks. It is what the model sees in every
 * other plugin path, where this script's own location may be a resolved
 * spelling of it (/private/var for /var on macOS).
 * @returns {string}
 */
function pluginRoot() {
  return process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..', '..');
}

/**
 * The files a Codex patch writes, in the order it names them. A deleted file is
 * not written; a moved one is written at its new path.
 * @param {string} patch - The apply_patch input.
 * @returns {Array<{ path: string, added: boolean }>}
 */
function patchedFiles(patch) {
  const files = [];
  for (const line of patch.split(/\r?\n/)) {
    const header = PATCH_FILE_HEADER.exec(line);
    if (header) {
      if (header[1] !== 'Delete') files.push({ path: header[2].trim(), added: header[1] === 'Add' });
      continue;
    }
    const move = PATCH_MOVE_HEADER.exec(line);
    if (move && files.length > 0) files[files.length - 1].path = move[1].trim();
  }
  return files;
}

/**
 * Absolute paths of the files a tool call writes. Claude Code's Edit, Write and
 * MultiEdit name one in `tool_input.file_path`; Codex's apply_patch names each
 * in the patch it carries as `tool_input.command`, relative to the session's cwd.
 * @param {object} input - The hook payload.
 * @param {{ createdOnly?: boolean }} [options] - Only the files the call creates:
 *   Write's target, or the files a patch adds.
 * @returns {string[]}
 */
function writtenFilePaths(input, { createdOnly = false } = {}) {
  const cwd = typeof input.cwd === 'string' && input.cwd ? input.cwd : process.cwd();
  const toolInput = input.tool_input || {};
  if (input.tool_name === 'apply_patch') {
    return patchedFiles(String(toolInput.command || ''))
      .filter(file => !createdOnly || file.added)
      .map(file => path.resolve(cwd, file.path));
  }
  if (createdOnly && input.tool_name !== 'Write') return [];
  return toolInput.file_path ? [path.resolve(cwd, String(toolInput.file_path))] : [];
}

/**
 * What a call that reads files names: Claude Code's Read gives the file path;
 * Codex reads through the shell, so it is the whole command.
 * @param {object} input - The hook payload.
 * @returns {string}
 */
function readTarget(input) {
  const toolInput = input.tool_input || {};
  return String(input.tool_name === 'Bash' ? toolInput.command || '' : toolInput.file_path || '');
}

/**
 * Write all of `text` to stdout before returning. A hook may exit right after
 * answering, and on macOS a pipe write is asynchronous: process.exit() would
 * cut it short.
 * @param {string} text - What to write.
 */
function writeStdout(text) {
  const bytes = Buffer.from(text, 'utf8');
  let written = 0;
  while (written < bytes.length) {
    try {
      written += fs.writeSync(1, bytes, written, bytes.length - written);
    } catch (err) {
      // A full non-blocking pipe: the host is still reading, so try again.
      if (err.code !== 'EAGAIN') throw err;
    }
  }
}

/**
 * Answer with context the model reads beside the tool call. Both hosts take
 * this shape from PreToolUse and PostToolUse; neither gives stderr to the model.
 * @param {object} input - The hook payload, for the event name the answer must repeat.
 * @param {string} text - The context.
 */
function emitContext(input, text) {
  writeStdout(JSON.stringify({ hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: text } }));
}

/**
 * Answer with a message for the user, which both hosts show and neither gives
 * the model.
 * @param {string} text - The message.
 */
function emitSystemMessage(text) {
  writeStdout(JSON.stringify({ systemMessage: text }));
}

module.exports = {
  hookHost,
  pluginRoot,
  patchedFiles,
  writtenFilePaths,
  readTarget,
  writeStdout,
  emitContext,
  emitSystemMessage,
};
