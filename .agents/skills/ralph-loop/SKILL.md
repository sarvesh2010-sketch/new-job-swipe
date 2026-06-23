---
name: ralph-loop
description: Enables cooperation with the Ralph autonomous agentic loop. Instructs the agent on how to process plans from the `.plans/` directory and emit appropriate completion signals.
---

# Ralph Loop Integration & Guidelines

Follow these guidelines whenever running under the Ralph autonomous loop system (indicated by the presence of a `.plans/` folder or `PROMPT.md` at the project root).

## Core Behaviors

1. **Read Task Instruction**:
   - Check the `.plans/` folder for task instructions (e.g., `.plans/PROMPT.md`, `.plans/prd.json`, or a similar specification file).
   - If `PROMPT.md` is present at the root, read it to understand the current iteration's goals.

2. **Autonomous Execution**:
   - Execute the task completely and autonomously.
   - Run tests, builds, and verification commands to confirm the task's success.

3. **Emit Completion Signal**:
   - Once the task or the current phase is fully completed and verified, you MUST output the exact XML tag below to signal the Ralph CLI that it can stop or progress to the next phase:
     ```xml
     <promise>COMPLETE</promise>
     ```
   - If the task failed or requires user clarification, explain the error clearly and do NOT emit the tag.

4. **Git Discipline**:
   - Ensure modifications are clean and prepared for git commit. Ralph or the runner will often commit these automatically or expect a clean working tree.
