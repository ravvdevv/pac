# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build     # Bundle with ncc (produces dist/)
npm run prepublishOnly  # Build before publish
```

No test framework is configured. Run manually: `node index.js` or `node dist/index.js`.

## Project

A CLI tool called **pac** that transforms messy user ideas into structured AI prompts. Published as `pac-ai` on npm.

## Architecture

```
index.js         ← CLI entry (commander), main loop
src/
  config.js      ← Onboarding flow, ~/.pacrc.json read/write, provider/model selection
  ai.js          ← Streaming API calls to OpenRouter, Gemini, Groq (fetch + async generators)
  prompts.js     ← System prompt templates and follow-up prompt builders
  ui.js          ← Terminal output helpers (banner, stream output, error formatting)
```

No TypeScript — plain ESM (`"type": "module"` in package.json). Bundled via `@vercel/ncc` into a single `dist/index.js`.

### Flow

1. `index.js` loads config (onboards if none exists) → `config.js`
2. User enters an idea → `ai.js` streams the response from the chosen provider → `prompts.js` provides system prompts
3. After output, user picks: copy to clipboard, follow-up/extend, regenerate, edit input, or quit
4. Follow-ups re-prompt with the current prompt + instructions; regenerate re-runs with the original idea

### Providers

- **OpenRouter** / **Groq**: OpenAI-compatible streaming API (`fetch` + SSE parser)
- **Gemini**: Google's `streamGenerateContent` SSE endpoint
- Config stored as JSON at `~/.pacrc.json` (provider, apiKey, model)

### Key details

- All API calls use native `fetch` (Node 18+) — no axios
- Streams are async generators (`async function*`), consumed in `ui.js:streamOutput`
- No TypeScript build step — `ncc` bundles the raw JS files
- Dynamic imports for `ora`, `clipboardy`, `@inquirer/search` (keeps startup fast)
