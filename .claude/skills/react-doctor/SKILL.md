---
name: react-doctor
description: Run after making React changes to catch issues early. Use when reviewing code, finishing a feature, or fixing bugs.
---

# React Doctor

Scans the React codebase for security, performance, correctness, and architecture issues. Outputs a 0-100 score with actionable diagnostics.

## Usage

```bash
pnpm dlx react-doctor@latest . --verbose --diff
```

## Workflow

1. Run the command above to scan the codebase
2. Review the output and score
3. Fix errors first (highest priority), then warnings
4. Re-run to verify the score improved
