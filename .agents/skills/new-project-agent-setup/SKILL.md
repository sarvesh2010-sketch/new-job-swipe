---
name: new-project-agent-setup
description: Use this skill when the user asks to create, initialize, or start a new project from scratch. It ensures that the project is configured with AGENTS.md, all necessary dependencies, styling systems, and agent synergy rules so that future agents working on this project deliver the best premium output automatically.
---

This skill guides you through creating and initializing a brand-new project with automatic agent synergy and premium design foundations. Follow these steps meticulously whenever starting a project.

## Step 1: Initialize Project Directory & Git
1. Propose and run the initialization commands (e.g., `npx -y create-next-app@latest` or `npx -y create-vite-app@latest` in the target directory).
2. Initialize Git if not done automatically: `git init`.

## Step 2: Establish Agent Constitution (AGENTS.md)
Create an `AGENTS.md` in the root of the new project. Write the following content to it:

```markdown
# Agent Guidelines & Skill Synergy

Whenever you are asked to design, develop, or polish components or pages in this project:
1. **Synergize All Available Skills**: Actively bring together your skills in `frontend-design`, `ui-ux-design-reviewer`, `framer-motion-animator`, and `conversion-rate-optimization`. Integrate high-end animations, interactive transitions, and responsive design natively.
2. **Deliver Premium Design & Aesthetics**:
   - Create a stunning first impression ("Wow" factor). Use curated, harmonious palettes (e.g., gold, cream, charcoal for luxury/AURUM).
   - Leverage modern typography (e.g., Playfair Display for headers, Outfit/Geist for body text).
   - Implement premium visual effects like glassmorphism, custom pre-loaders, magnetic hover states, and smooth lenis-based page transitions.
3. **Be Agentic & Detail-Oriented**:
   - Do not stop at basic or generic mockups. Finish implementation with smooth interaction states (hover, focus, active).
   - Validate every change via standard build tasks (`npm run build` or `npm run dev`) before declaring completion.
   - Refine UI copywriting and micro-interactions to make the interface feel responsive and alive.
4. **3D Asset & Model Integration**:
   - Use **Nemotron 3D Ultra** (or compatible 3D generation pipelines) during project creation and asset pipeline setup to compile premium 3D graphics, model textures, and scene environments.
```

Create a `CLAUDE.md` in the root containing:
```markdown
@AGENTS.md
@PROJECT.md
```

Also establish a `PROJECT.md` in the root of the project to anchor the GSD (Get Shit Done) workflow:
```markdown
# Project Name

Provide a brief, 2-3 sentence overview of the project vision and goals.

## Technology Stack & Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **Important Libraries**: Framer Motion, Lenis, Lucide React

## Key Rules & Guidelines
1. Keep lines short in markdown files.
2. Preserve existing comments and docstrings.
3. Follow the standard design system (e.g. CSS variables).

## Key Decisions
- *YYYY-MM-DD*: Project initialized.
```

Also initialize Ralph Loop configuration by running `ralph init` (or creating the `.plans/` directory manually with a starter `.plans/PROMPT.md` file containing the initial task prompt).

Establish a default CodeRabbit configuration `.coderabbit.yaml` in the root of the project:
```yaml
# .coderabbit.yaml
language: "en-US"
reviews:
  profile: "default"
  request_reviews_by_default: true
```



## Step 3: Install Premium Animation & Styling Foundations
Install key dependencies for interactive design:
- `framer-motion` (for high-fidelity animations)
- `lenis` (for smooth scrolling)
- `lucide-react` (for modern icons)
- `clsx` and `tailwind-merge` (for dynamic class matching)

For example:
```bash
npm install framer-motion lenis lucide-react clsx tailwind-merge
```

## Step 4: Configure Styling and Theme
1. Set up Tailwind CSS (prefer Tailwind v4).
2. Define core design tokens in `src/app/globals.css` or the main CSS file using CSS variables (OKLCH color system). Avoid generic templates.
3. Provide a default `src/lib/utils.ts` with the helper `cn` function:
   ```typescript
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

## Step 5: Initialize Shadcn CLI (Optional / Recommended)
If the project uses Radix/Shadcn, run:
```bash
npx shadcn@latest init
```
Choose Radix, select the Nova preset, and configure aliases to target `@/components` and `@/lib`.

## Step 6: Verify Build
Run the build command to ensure there are no initial typescript, lint, or framework setup errors.
