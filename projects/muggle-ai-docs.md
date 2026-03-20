# muggle-ai-docs

Markdown documentation for the Muggle AI platform.

## Overview

- Contains Markdown files served to users via raw GitHub URLs
- `manifest.json` defines the documentation routing structure
- The UI (muggle-ai-ui) loads the manifest at runtime to build its documentation navigation

## Structure

- All documentation is in Markdown format
- `manifest.json` is the entry point that maps routes to documentation files
- Content is fetched directly from GitHub raw URLs by the frontend
