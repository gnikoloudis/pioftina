<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Antigravity Project Guardrails & Instructions

## 1. Project Overview & UX Standards
- **Purpose**: Maintain an intuitive, highly responsive, and accessible application experience.
- **UI/UX Consistency**: 
  - Adhere strictly to existing design system tokens, typography scales, and color schemes. Do not introduce arbitrary CSS or inline styles unless required for dynamic computations.
  - Ensure all interactive elements have correct ARIA labels, semantic HTML tags, and keyboard navigation support (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
  - Optimize layout shifts (CLS) and follow responsive mobile-first patterns.

## 2. Security & Privacy Guardrails (Strict Enforcement)
- **Data Minimization & Handling**:
  - **Never** log, hardcode, or commit sensitive credentials, API keys, tokens, or personal identifiable information (PII) into source code or test fixtures.
  - Always use environment variables (`.env`, `.env.example`) for configuration flags and secrets.
- **File System & Path Traversal Protection**:
  - Agents are strictly restricted from modifying system paths, configuration files outside the repository, or sensitive directories (`~/.ssh`, `/etc`, etc.).
  - Restrict write operations to designated application modules. Do not alter root infrastructure configurations without explicit review.
- **Command & Terminal Execution Controls**:
  - Only execute allowed safe utility commands (`npm run dev`, `pnpm test`, `git status`, `ls`).
  - Destructive commands (`rm -rf`, force pushes, database resets) are **strictly blocked** unless explicitly authorized by the user via review-driven mode.
- **Browser Automation Security**:
  - Restrict browser testing agent navigation to local environments (`http://localhost:*`) or explicitly pre-approved internal domains to prevent external prompt injection attacks.

## 3. Build, Test, & Development Commands
- **Dependency Management**: Use `pnpm install` (or your project's chosen package manager).
- **Local Server**: Run `pnpm dev` to launch the development environment.
- **Testing & Quality Control**:
  - Run `pnpm test` to verify unit and integration tests before finishing tasks.
  - Run `pnpm lint` and type checks to confirm zero warnings or errors.
  - **Self-Correction Rule**: If a build or test fails, the agent must catch its own error, analyze the stack trace, patch the code, and re-run the validation suite independently before presenting solutions to the user.

## 4. Multi-Agent Collaboration Protocol
- **Non-Overlapping Scopes**: When executing parallel tasks using sub-agents or worker instances, strictly isolate file paths (e.g., Worker 1 handles `/api`, Worker 2 handles `/components`) to prevent race conditions and silent overwrites.
- **Review-Driven Workflows**: Pause execution and request human approval at high-risk decision points:
  - Before executing arbitrary shell scripts or terminal commands.
  - Before finalizing implementation plans or merging critical branches.
