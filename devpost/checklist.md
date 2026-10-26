---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [ ] **1. Enter a goal and task and see their connection**
  Becomes usable: A locally running FocusFlow page with labeled goal and task inputs; as both are entered, an editable first-person connection sentence appears. The page also shows the approved static timer display and an empty session-history section; neither has timer or persistence behavior in this slice.
  Why now: Bootstraps Vite inside the first usable slice and puts the unique goal-to-task connection in front of the learner immediately. Keeping timer and history static makes this slice testable without implying that their later behavior is already implemented.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Saved-Goal View and Task Planning`
  Spec ref: `spec.md > Stack`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > Look and Feel`, `spec.md > Components`, `spec.md > File Structure`
  Build: Create the minimal Vite setup with HTML, CSS, and JavaScript ES modules; update `.gitignore` to retain its existing privacy rules and add generated `node_modules/` and `dist/`; create the welcome/interface shell with accessible goal and task labels, the editable rule-based connection, a clearly static timer preview, and a no-sessions empty state; add a focused connection-function test and README setup commands. Do not add persistence, a working timer, or recovery logic.
  Verify (mechanical): Run `npm test` and `npm run build`; start `npm run dev` and confirm Vite serves the app at its local URL without errors. Manually verify the page renders at desktop and narrow mobile widths, both fields are keyboard accessible, and entering goal/task text updates the editable connection. Confirm timer stays static and history stays empty.
  Learner check: Open the local app, enter a goal and task, inspect and edit the suggested connection, then view the static timer and empty history at desktop and mobile widths. Report whether the wording and layout match the intended calm, focused experience.
  Commit: `Build initial goal-task interface`

- [ ] **2. Save the goal and prepare one daily task**
  Becomes usable: A learner can create or edit one goal, keep it across reloads, enter one specific task, choose an allowed duration, edit or confirm the connection, and review the session preview.
  Why now: Completes the plan-before-focus part of the journey after the core connection interface is visible; saved data is introduced only when the learner can use the setup flow.
  PRD ref: `prd.md > First Visit and Goal Setup`, `prd.md > Saved-Goal View and Task Planning`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Add goal create/edit and whitespace validation, optional goal context, the saved-goal view, one-task form, the 15/25/30/45-minute selector, editable connection, optional done-result, preview, and browser-local goal persistence. Preserve existing form values on validation errors.
  Verify (mechanical): Run `npm test` and `npm run build`; tests cover connection output and goal storage/validation helpers. Manually reload and confirm the goal persists and invalid required fields do not advance.
  Learner check: Save a goal, reload, edit it, then prepare a task and confirm the preview shows the current goal, task, connection, and chosen duration.
  Commit: `Add saved goal and task planning`

- [ ] **3. Run and recover an honest focus session**
  Becomes usable: A learner can start, pause, resume, and end a session; see an accurate countdown; and recover after interruption without counting uncertain background time.
  Why now: The session timer depends on a valid task preview and saved goal. Timestamp arithmetic and recovery are tested as one behavior before reflection relies on its actual-time value.
  PRD ref: `prd.md > Focus Session and Timing`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Add timestamp-based timer calculations, active/paused state, checkpoint persistence, tab-switch behavior, duration cap, and resume/end recovery prompt. Do not infer task completion from timer completion.
  Verify (mechanical): Run `npm test` and `npm run build`; timer tests use fixed timestamps for elapsed time, pause/resume, tab time, cap, and recovery from the last successful checkpoint. Manually confirm reload recovery excludes the uncertain gap.
  Learner check: Start a short test session, switch tabs, pause, resume, and end early; verify the display and active-time result follow the documented rules.
  Commit: `Add focus timer and recovery`

- [ ] **4. Save reflections and review session history**
  Becomes usable: A learner can record the outcome and reflection after a completed or early-ended session, review a saved summary, and browse previous summaries without changing them.
  Why now: This closes the core journey using the saved goal, task, and verified active-time behavior from earlier slices.
  PRD ref: `prd.md > Reflection and Session Summary`, `prd.md > Past Sessions`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`, `spec.md > Manual Acceptance Criteria`
  Build: Add reflection choices and optional note, save completed session records, show the observable summary, add newest-first read-only history and the “Plan My Next Session” path that reuses the goal without auto-starting.
  Verify (mechanical): Run `npm test` and `npm run build`; storage tests cover saving/retrieving goal and sessions. Manually reload and verify saved reflections/history persist, order newest first, and past summaries remain unchanged when viewed.
  Learner check: Complete a session, save a reflection, review the summary, open a past session, return to the goal view, and plan another session without changing or auto-starting the prior one.
  Commit: `Add reflection and session history`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 1, use feedback to refine the remaining interface only within the approved PRD/spec.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 4, exercise the full journey and resolve agreed issues.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Not started.
Route and stops: Not started.
Edit outcome: Not applicable yet.
Reflection: Not offered yet.
Activity mode: Not started.

## Revisions
