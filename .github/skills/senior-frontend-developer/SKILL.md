---
name: senior-frontend-developer-skill
description: "Use this skill when the senior-frontend-developer agent must implement frontend code, fix React or TypeScript issues, improve UI behavior, or validate the ai-telecom-frontend app against user requirements."
---

# Senior Frontend Developer Skill

This skill belongs to the senior-frontend-developer agent and is intended for frontend implementation work in the ai-telecom-frontend app.

## When to use this skill
- The user asks to build, fix, or improve a frontend feature.
- The request targets React, TypeScript, Vite, styling, routing, hooks, context, or UI logic.
- The task involves changing components or screens in the app and validating the result in the browser.

## Goal
Write and ship frontend code that matches the user requirement while keeping the app stable, maintainable, and accessible.

## Workflow

### 1. Understand the requirement
- Read the request carefully and identify the exact UI behavior to change.
- Confirm whether the task is styling, interaction, validation, page flow, dashboard logic, state handling, or integration work.
- Check whether the app already has a pattern for the same feature.

### 2. Inspect the relevant frontend files
- Focus on the app folder under ai-telecom-frontend.
- Read the relevant component, page, service, hook, or CSS file before editing.
- Track the route, state, and data flow involved in the feature.

### 3. Implement the smallest correct fix
- Prefer a targeted edit over broad refactoring.
- Reuse existing patterns, naming conventions, and design language.
- Keep the UI responsive and TypeScript-safe.
- Avoid unnecessary libraries or changes outside the app unless required.

### 4. Handle common frontend decisions
- If the task is a visual change, update components and styling without changing unrelated behavior.
- If the task adds logic, maintain state in the existing React pattern and keep side effects contained.
- If data is required, inspect the relevant services and API contract before wiring it to the UI.
- If a component is already doing similar work, extend that pattern rather than inventing a new structure.

### 5. Validate before claiming success
- Run the frontend build to catch TypeScript and Vite issues.
- Fix root causes rather than suppressing errors.
- Start the dev server and inspect the page in the browser.
- Confirm the feature works in actual runtime behavior, not just by reading code.

## Completion checks
A task is complete only when all of the following are true:
- The requested feature or bug fix is implemented in the frontend code.
- TypeScript and build checks pass or any remaining issues are clearly identified and resolved.
- The UI behaves correctly in the browser for the requested flow.
- The change is scoped to the app and does not introduce unrelated breakage.

## Anti-patterns to avoid
- Making broad, unrelated refactors.
- Adding unused imports or invalid inline styles.
- Hard-coding behavior without checking existing use cases.
- Claiming success without running the app and confirming the result.
- Changing backend code when the requirement can be satisfied in the frontend alone.

## Example prompts
- Add a responsive billing summary page with filters and status cards.
- Fix the login form validation and loading state in the auth flow.
- Improve the support ticket list UI and empty states.
- Implement a new telecom dashboard section with charts and plan highlights.
- Update the mobile layout for the voice assistant interface.

## Output expectation
The agent should produce working frontend code in ai-telecom-frontend, validate it with a build and browser check, and report the result with evidence.
