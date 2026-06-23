---
name: get-shit-done
description: Core spec-driven development and context engineering system for all projects. Enforces a structured workflow using PROJECT.md and SPEC.md to maintain context integrity and guarantee verified delivery.
---

# Get Shit Done (GSD) Workflow

Follow this spec-driven development workflow for every task, bug fix, or feature request in this project to prevent context rot and ensure high-quality, verified delivery.

## Core Principles
1. **Spec First, Code Second**: Never write or modify code before writing down the specification (`SPEC.md` or `implementation_plan.md`) and getting approval or verifying alignment.
2. **Single Source of Truth**: Keep a persistent `PROJECT.md` at the project root to store stable high-level rules, architecture choices, and tech stacks.
3. **Atomic Execution**: Break tasks down into clear milestones with atomic verification steps.
4. **Verification**: Compile, test, and lint after every phase.

---

## Phase 0: Discuss & Gather Context
Before writing any implementation plan or modifying code:
1. Locate and read the `PROJECT.md` at the root of the project to understand the global rules, technology stack, constraints, and architecture.
2. If `PROJECT.md` does not exist, initialize it using the template below.
3. Discuss the requirements and identify edge cases, architectural implications, and success metrics.

---

## Phase 1: Plan & Specify
Create or update the specification file (`SPEC.md` or `implementation_plan.md` / `task.md`):
1. **Requirements**: Detail the capabilities that need to be added or modified.
2. **Constraints & Architecture**: Note coding style rules, directories to modify, and design system constraints.
3. **Task List**: List out the atomic steps required.
4. **Success Criteria**: Document how you will verify each step (e.g. build commands, test commands, visual checks).

---

## Phase 2: Execute & Implement
For each step in the Task List:
1. Modify only the relevant files. Keep edits clean, using precise code replacement tools.
2. Run linting/formatting or build commands to ensure correctness.
3. Mark the step as complete in your task tracking file.

---

## Phase 3: Verify & Walkthrough
1. Run full test suites, typecheckers, and production builds (`npm run build`).
2. Document what was done and show validation results in a walkthrough.
3. Commit changes with a clean, descriptive message.

---

## Templates

### PROJECT.md Template
```markdown
# Project Name

Provide a brief, 2-3 sentence overview of the project vision and goals.

## Technology Stack & Architecture
- **Framework**: (e.g. Next.js App Router, Vite, React)
- **Styling**: (e.g. Tailwind CSS, CSS Modules, Vanilla CSS)
- **State Management**: (e.g. React Context, Zustand, Redux)
- **Important Libraries**: (e.g. Framer Motion, GSAP, Lucide React)

## Key Rules & Guidelines
1. Keep lines short in markdown files.
2. Preserve existing comments and docstrings.
3. Follow the standard design system (e.g. CSS variables).

## Key Decisions
- *YYYY-MM-DD*: Decided to use X for Y because Z.
```

### SPEC.md Template
```markdown
# Specification: [Task Name]

## Requirements
- Capability 1
- Capability 2

## Constraints
- Constraint 1

## Success Criteria / Verification Plan
- [ ] Command to run unit tests
- [ ] Command to run build/typecheck
- [ ] Manual verification flow
```
