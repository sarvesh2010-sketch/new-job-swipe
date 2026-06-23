---
name: coderabbit
description: Integrates CodeRabbit AI-powered code reviews into local development. Enforces running `coderabbit review` to automatically analyze changes and manage review configurations.
---

# CodeRabbit Integration & Guidelines

Use this skill to leverage CodeRabbit's automated local review workflows on any project.

## Core Commands

1. **Local Review**:
   - Run `coderabbit review` in a git repository to request an AI review of your current, uncommitted local changes.
   - Run `coderabbit review --agent` to generate structured machine-readable findings that can be consumed or processed by this agent or CI pipelines.

2. **Check Stats**:
   - Run `coderabbit stats` to display code review statistics and metric insights for the project.

3. **Updating the CLI**:
   - Run `coderabbit update` if you need to fetch the latest version of the CodeRabbit executable.

---

## Configuration (`.coderabbit.yaml`)

CodeRabbit can be configured via a `.coderabbit.yaml` file in the root of the repository. When starting a project or if requested, customize code review rules using this format:

```yaml
# .coderabbit.yaml
language: "en-US"
reviews:
  profile: "default"
  request_reviews_by_default: true
  high_level_summary: true
  auto_copy_amend: false
  tools:
    ast-grep:
      enabled: true
    bundler-audit:
      enabled: true
chat:
  auto_reply: true
```
