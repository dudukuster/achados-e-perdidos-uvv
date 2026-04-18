# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT

- Always double-check your responses. Be skeptical - don't accept assumptions at face value, including mine. I'm not always right, and neither are you. Question claims, verify information, and push back when something seems off. Together we get closer to the truth.
- *DO NOT USE MINIMAL API*, use controllers.

## Workflow Orchestration

### 1. Plan Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update Docs/lessons.md with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer. KISS, keep it simple stupid
- Challenge your own work before presenting it

### 6.Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. *Plan First*: Write plan to Docs/todo.md with checkable items
2. *Verify Plan*: Check in before starting implementation
3. *Track Progress*: Mark items complete as you go
4. *Explain Changes*: High-level summary at each step
5. *Document Results*: Add review section to Docs/todo.md
6. *Capture Lessons*: Update Docs/lessons.md after corrections

## UC Completion Protocol

After finishing any UC implementation, ALWAYS execute this checklist before moving on:

1. *Build* — dotnet build must pass with 0 errors
2. *Verify* — check for technical debt: unused usings, dead code, inconsistent patterns
3. *Mark UC* — update the UC's Criterios de Aceite checkboxes
4. *Mark Complete* — update Docs/backend/UC/FaseN/faseN-complete.md (status + progress count)
5. *Commit* — git add only the changed files, commit with feat: [description] (UC N-XXX)
6. *Push* — git push to remote

## Core Principles

- *Simplicity First*: Make every change as simple as possible. Impact minimal code.
- *No Laziness*: Find root causes. No temporary fixes. Senior developer standards.
- *Minimal Impact*: Changes should only touch what's necessary. Avoid introducing bugs.

## Backend–Frontend Contract (CRITICAL)

*BEFORE writing any frontend code that calls the backend, you MUST read the backend source code to verify:*

1. *Response envelope* — Is it ApiResponse<T> (200 with { data, meta }) or PaginatedApiResponse<T> (200 with { data[], meta }) or 204 No Content (empty body)?
2. *HTTP status codes* — What status does each outcome return? (200, 201, 204, 404, 409, 422)
3. *Property casing* — camelCase (ASP.NET default) or PascalCase?
4. *DTO fields* — Read the EXACT record/class definition. Don't assume fields exist.
5. *Validation format* — FluentValidation returns 422 with { errors: [{ field, message }] }. Conflict returns 409 with ProblemDetails.
6. *Input format* — What format does the backend expect? (e.g., CPF as 11 digits, dates as yyyy-MM-dd, decimals as 0.05 not 5)

*Checklist for every API integration:*

- [ ] Read the Controller endpoint (HTTP method, route, response type)
- [ ] Read the Handler (what it returns on success/failure)
- [ ] Read the DTO (exact fields and types)
- [ ] Read the Validator (required fields, format constraints)
- [ ] Read ResultExtensions.cs for how Result maps to HTTP status
- [ ] Handle 204 No Content (don't try to parse empty body)
- [ ] Handle 201 Created (body has ApiResponse<T>, not raw DTO)
- [ ] Apply masks on display, unmask before sending to API
- [ ] Test with the actual backend response, not assumptions

## Frontend Style Guide (CRITICAL)

*BEFORE writing any frontend UI code, you MUST consult the Style Guide (frontend/src/routes/style-guide.tsx) as the single source of truth for:*

1. *Available components* — Only use components that exist in the style guide. If a component doesn't exist there, STOP and inform the user so we can create it first.
2. *Design tokens* — Use the defined color palette (Primary blue, Accent gold, Neutrals, Semantics), typography (Inter for UI, JetBrains Mono for numbers), spacing scale, and border radius tokens.
3. *Component variants* — Use the exact variants, sizes, and props demonstrated in the style guide. Don't invent custom variants.
4. *Patterns* — Follow the established patterns for forms, form errors, loading states, empty states, and responsive layouts as shown in the style guide.
5. *Composition* — Build pages by composing existing components. Don't create one-off styled elements when a style guide component exists.

*Checklist for every frontend UI task:*

- [ ] Read frontend/src/routes/style-guide.tsx to identify which components to use
- [ ] Verify the component exists in frontend/src/components/ui/
- [ ] Use design tokens from frontend/src/index.css (never hardcode colors, spacing, or fonts)
- [ ] Follow the patterns shown in the style guide for the type of UI being built (form, table, dialog, etc.)
- [ ] If a needed component or variant doesn't exist, inform the user before proceeding

*Available UI components (shadcn/ui, Fotus-themed):* Alert, Avatar, Badge, Button, Calendar, Card, Checkbox, Dialog, Dropdown Menu, Input, Label, Popover, Progress, Radio Group, Select, Separator, Sheet, Sidebar, Skeleton, Switch, Table, Tabs, Textarea, Toast (Sonner), Tooltip.