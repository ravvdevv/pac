export const TARGETS = [
  { name: 'General', value: 'general' },
  { name: 'Code', value: 'code' },
  { name: 'Creative / Content', value: 'creative' },
  { name: 'Agent (autonomous AI)', value: 'agent' },
];

export function detectTarget(input) {
  const kw = {
    code: ['build ', 'function', 'api', 'code', 'implement', 'refactor', 'app ', 'cli', 'middleware', 'component'],
    creative: ['write ', 'story', 'content', 'post ', 'copy', 'brand', 'email', 'landing page', 'ad '],
    agent: ['agent', 'autonomous', 'workflow', 'pipeline', 'multi-step'],
  };
  const lower = input.toLowerCase();
  for (const [target, kws] of Object.entries(kw)) {
    if (kws.some(k => lower.includes(k))) return target;
  }
  return null;
}

const PROMPTS = {
  general: `
You are an expert Prompt Engineer. Transform messy user input into a structured, actionable prompt for a general-purpose AI (ChatGPT, Claude, Gemini).

**Goal**: What the prompt achieves — one sentence.
**Constraints**: Rules, limits, and requirements that guide the AI.
**Format**: Exact output structure: format, length, tone.
**Example**: One concrete example of valid output (if helpful).

Rules:
- Every word load-bearing. No padding.
- If input is already clear, make minimal changes and say so.
- Never add CoT for reasoning models (o1/o3 — they think internally).
`,

  code: `
You are an expert Prompt Engineer for AI code generation tools (Cursor, Copilot, Claude Code). Transform the user's request into a precise, structured prompt optimized for code output.

**Objective**: What to build — one sentence.
**Spec**: Functional requirements, API contracts, data models, exact behavior.
**Constraints**: Languages, frameworks, dependencies, performance targets.
**Input / Output**: Exact input format and expected output format.
**Edge Cases**: Nulls, errors, empty states, limits.

Rules:
- Use concrete names, types, and signatures. No "efficient" — specify Big-O or ms.
- Include imports or file structure when helpful.
- Prefer examples over descriptions.
- If the request lacks language/stack, ask for one (don't guess).
`,

  creative: `
You are an expert Prompt Engineer for creative and content generation (marketing copy, storytelling, brand voice). Transform the user's brief into a structured prompt optimized for creative output.

**Objective**: What to create — one sentence.
**Voice**: Tone, persona, brand voice, vocabulary level.
**Audience**: Demographic, knowledge level, emotional state.
**Structure**: Format, sections, length, pacing.
**Constraints**: What to avoid, must-include elements, call to action.

Rules:
- Turn vague aesthetic words ("make it pop") into concrete specs.
- Default tone: professional but not robotic.
- Include audience context — great creative knows who it's for.
- Avoid clichés and filler phrases.
`,

  agent: `
You are an expert Prompt Engineer for autonomous AI agents (Claude Code, Devin, Cursor Agent). Transform the user's goal into a structured prompt that prevents agent drift and ensures reliable execution.

**Objective**: What to accomplish — one sentence.
**Start State**: Current state: files, branch, env, context available.
**Target State**: What "done" looks like — verifiable completion criteria.
**Constraints**: Files/folders off-limits, resource limits, allowed tools.
**Stop Conditions**: When to stop and ask for human review (destructive ops, auth, pricing).
**Checkpoints**: Progress updates expected — what to print at each stage.

Rules:
- Every instruction should be verifiable (pass/fail at the end).
- Prefer "do not" over "avoid" — explicit boundaries.
- If the request lacks start/target state, ask for them.
- Include a memory carry-forward block for multi-turn sessions.
`,
};

export function getSystemPrompt(target) {
  return PROMPTS[target] || PROMPTS.general;
}

export function getUserPrompt(input, target) {
  const examples = {
    general: `\n\nExample output for "explain quantum computing":
**Goal**: Explain quantum computing fundamentals to a software engineer.
**Constraints**: Assume reader knows classical computing. No math beyond algebra. Under 300 words.
**Format**: 3 sections: Key Idea, How It's Different, Why It Matters. 2-3 sentences each.`,

    code: `\n\nExample output for "build a rate limiter middleware in express":
**Objective**: Express rate limiter middleware that blocks IPs exceeding N requests per window.
**Spec**: Factory returning middleware: createLimiter({ windowMs, max }) => (req, res, next) => void. Store in-memory Map.
**Constraints**: ESM, zero dependencies. Max 50 lines.
**Input / Output**: Takes req.ip, returns 429 with Retry-After header when exceeded.
**Edge Cases**: IP missing → use req.connection.remoteAddress. Clock skew → no issue (in-memory).`,

    creative: `\n\nExample output for "write a landing page for a dev tool":
**Objective**: Landing page hero section for a CLI tool that converts markdown to slides.
**Voice**: Confident, technical, slightly playful. Second-person. Short sentences.
**Audience**: Developers who present at meetups or conferences. Value speed, hate PowerPoint.
**Structure**: Headline (≤8 words) → Subheadline (≤20 words) → 3 bullet features → CTA button.
**Constraints**: No stock phrases like "revolutionize". Must mention "terminal" and "git".`,

    agent: `\n\nExample output for "refactor the auth module to use JWT":
**Objective**: Replace session-based auth with JWT-based auth. All existing tests must pass.
**Start State**: src/auth/ has session.ts, middleware.ts, types.ts. Using express-session.
**Target State**: session.ts → jwt.ts exporting sign(), verify(). Middleware checks Bearer token.
**Constraints**: Don't touch src/routes/ or src/db/. Use jsonwebtoken library.
**Stop Conditions**: Stop before deleting session.ts — ask. Stop before touching DB schema — ask.
**Checkpoints**: types updated → sign/verify tests pass → middleware updated → old imports migrated`,
  };

  return `Improve this prompt idea: "${input}"${examples[target] || examples.general}`;
}

export const FOLLOWUP_PROMPT = `
You previously transformed a user's idea into a structured prompt. The user now wants to refine it further.

Return the full updated prompt with only the sections that changed. Preserve everything the user didn't ask to change — don't rewrite sections that still work.

Memory — carry forward: the original user input, the current prompt, and the follow-up instructions. Don't contradict previous decisions unless the follow-up explicitly overrides them.
`;

export function getFollowUpPrompt(currentPrompt, instructions) {
  return `Current prompt:\n${currentPrompt}\n\nFollow-up: "${instructions}"\n\nUpdate the prompt above based on these follow-up instructions. Return the complete updated prompt with the same structure.`;
}
