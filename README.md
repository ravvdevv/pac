# PAC — Prompt Auto Create

Transform your messy, fragmented ideas into high-quality, structured AI prompts directly from your terminal.

## Features

- **Zero-Friction Onboarding**: Set up your AI provider (OpenRouter, Gemini, or Groq) in seconds.
- **Dynamic Model Selection**: Search through hundreds of models via OpenRouter or pick from high-performance defaults.
- **Iterative Refinement**: Use the **Follow up / Extend** feature to polish prompts until they are perfect.
- **Terminal-First Design**: Minimalist aesthetic with high-quality animations and zero external windows.
- **Clipboard Integration**: Instantly copy your refined prompts to use anywhere.

## Installation

### Globally
```bash
# Using bun
bun install -g @ravvdevv/pac

# Using npm
npm install -g @ravvdevv/pac
```

### Run without installing
```bash
npx @ravvdevv/pac
# or
bunx @ravvdevv/pac
```

## Usage

### Interactive Mode
Launch the interactive flow to refine an idea:
```bash
pac
```

### Direct Mode
Pass your idea directly to skip the first prompt:
```bash
pac "create a high-performance rust api with auth"
```

### Configuration
Manage your setup:
```bash
pac config    # View current setup
pac --reset   # Re-run onboarding
```

## Supported Providers

- **OpenRouter**: Access GPT-4o, Claude 3.5, Llama 3, and more.
- **Gemini**: High-speed, high-context intelligence from Google.
- **Groq**: Ultra-fast inference for rapid prompt generation.

## License

MIT © 2026 Raven
