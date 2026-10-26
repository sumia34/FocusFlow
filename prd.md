---
doc: prd
status: approved
---

# FocusFlow — Product Requirements Document

## 1. Product Overview

FocusFlow helps independent learners turn one meaningful long-term goal into one manageable daily action, focus on that action, and reflect on the outcome.

The product encourages consistent, realistic progress without guilt, arbitrary productivity scores, or unnecessary complexity.

**Core principle:** Progress comes from meaningful steps, not perfect days.

**Source of truth:** `scope.md` defines the product boundary and core experience. `spec.md` defines the technical implementation and data-handling behavior. This PRD defines the intended user experience, product requirements, and acceptance criteria.

## 2. Target User and Problem

### Target user

Independent learners who want to make progress toward a meaningful long-term goal but need help choosing a manageable next action and reflecting on how it went.

### Problem

Learners may struggle to connect long-term ambitions with daily actions. They can also find complicated productivity systems overwhelming or discouraging.

### Product outcome

FocusFlow should help a learner:

- Identify one meaningful long-term goal.
- Choose one specific task that supports that goal.
- Set aside a defined period for focused work.
- Record what happened without judgment.
- Use the experience to plan the next manageable action.

## 3. Product Principles

1. **One goal at a time:** Keep the core experience centered on a single current goal.
2. **One task per session:** Avoid unnecessary task-management complexity.
3. **User control:** The learner chooses their goal, task, and reported outcome.
4. **Honest measurement:** Report timer-running time as active session time, not proof of concentration.
5. **Nonjudgmental reflection:** Support learning from incomplete or interrupted sessions.
6. **Local-first privacy:** Keep saved information in the current browser without requiring an account or cloud service.
7. **Simple navigation:** Guide the learner through a short sequence rather than a complex dashboard.
8. **Accessible interaction:** Provide clear labels, keyboard-operable controls, and understandable validation messages.

## 4. Core User Journey

1. **Welcome:** The learner sees the product purpose, a clearly labeled example, and the primary action, "Set My First Goal."
2. **Set a goal:** The learner enters a required long-term goal and optional motivation and progress descriptions.
3. **Save the goal:** The app validates the goal, saves it locally, and displays the saved-goal view.
4. **Plan a task:** The learner describes one task, selects a supported duration, and confirms or edits the suggested goal-connection sentence.
5. **Review the plan:** The learner checks the goal, task, connection, and planned duration before starting.
6. **Focus:** The learner starts a countdown and can pause, resume, or end the session early.
7. **Reflect:** After completion or early ending, the learner reports the task outcome, perceived focus, and optional reflection.
8. **Review the summary:** The app saves the session and presents the planned duration, actual active session time, outcome, and reflection.
9. **Continue or finish:** The learner can plan another session using the same goal, return to the saved-goal view, or leave.
10. **Review history:** The learner can browse past sessions and open saved summaries in read-only mode.

The app must not automatically start a new session, mark a task complete, or invent a reflection on the learner's behalf.

## 5. Functional Requirements

### 5.1 Welcome and First Visit

The first-visit experience must:

- Display the headline: "Make today count toward your bigger goal."
- Explain: "Choose what matters to you, take one manageable step, and reflect on the progress you make."
- Show a clearly labeled example that is not saved as user data.
- Provide one primary action: "Set My First Goal."
- Avoid requiring an account, sign-in, or onboarding questionnaire.

Example content:

- Goal: Become a web developer.
- Task: Practise JavaScript for 30 minutes.
- Connection: Practising JavaScript helps build the skills needed to become a web developer.

**Acceptance criteria**

- The example is visibly identified as an example.
- The example does not overwrite or masquerade as the learner's saved goal.
- A new learner can begin goal setup directly.
- A returning learner with a saved goal sees the saved-goal view.

### 5.2 Goal Setup and Editing

The goal form must include:

- Required field: "My long-term goal."
- Optional field: "Why does this goal matter to you?"
- Optional field: "What would progress look like?"
- Primary action: "Save My Goal."
- A back or cancel action.

The interface should reassure the learner that choosing a goal is not a permanent commitment.

Validation requirements:

- Reject empty or whitespace-only goals.
- Display "Enter a goal you'd like to work toward." beside the invalid field.
- Preserve other entered values when validation fails.
- Associate the error message with the field for assistive technology.
- Clear the error when the field is corrected.
- Focus the first invalid field when appropriate.
- Do not save invalid goal data.

After a valid save, display a brief confirmation and the saved-goal view.

Editing a goal must not unnecessarily delete previously saved sessions. Historical sessions should retain the goal details recorded for those sessions.

**Acceptance criteria**

- A valid goal can be saved when both optional fields are empty.
- An invalid goal is not saved.
- Correcting the goal allows the learner to submit it successfully.
- Editing the current goal does not erase session history.

### 5.3 Saved-Goal View

The saved-goal view must display:

- The current long-term goal.
- Optional motivation and progress information, when provided.
- The primary action: "Choose Today's Task."
- An option to edit the goal.
- A quieter "View Past Sessions" action.

The layout must remain focused on the current goal and the next action rather than expanding into a dashboard.

**Acceptance criteria**

- The current goal is visible after saving and after a normal page reload.
- The learner can edit the goal or begin task planning.
- Past-session history remains accessible without competing with the primary action.

### 5.4 Task Planning and Preview

The task form must support one specific daily action.

Required fields:

- "What will you work on?"
- Focus duration: 15, 25, 30, or 45 minutes.
- A goal-connection sentence that the learner can confirm or edit.

Optional field:

- "What will count as done?"

The app may suggest a short connection sentence based on the current goal and task. This suggestion must remain editable and must not be presented as an authoritative judgment about the learner's choices.

Do not add multiple tasks per session, priorities, deadlines, categories, or recurring schedules to the PoC.

Validation messages:

- Task: "Describe one specific task you want to work on."
- Connection: "Add a short explanation of how this task supports your goal."

Invalid submissions must preserve entered values and must not start the timer or create an incomplete session.

Before starting, show a compact preview containing:

- Current goal.
- Planned task.
- Confirmed goal connection.
- Selected duration.
- Optional definition of done, if provided.

**Acceptance criteria**

- Only the four specified duration choices are offered.
- Required fields are validated before a session starts.
- The learner can edit the suggested connection.
- The preview reflects the confirmed values.
- Invalid input does not start a timer or save an incomplete session.

### 5.5 Focus Session and Timer

When the learner selects "Start Focus Session," the app must:

- Record the session start time.
- Start the countdown using the selected duration.
- Keep the task, goal connection, and remaining time easy to see.
- Provide pause, resume, and end-early controls.
- Exclude paused time from active session time.

Timer behavior:

- Pausing stops the active countdown.
- Resuming continues from the remaining time.
- Switching browser tabs does not automatically pause the session.
- Tab switching alone is not an interruption and must not be treated as evidence of lost focus.
- Reaching zero ends the timed portion and opens the reflection flow.
- Ending early also opens the reflection flow.
- Timer completion must never automatically mark the task complete.

The app should calculate elapsed time using timestamps and recorded pauses rather than relying exclusively on the number of timer callbacks. This helps keep the countdown accurate when browser timers are delayed.

If a reload or browser closure interrupts a session, the app must not automatically count uncertain background time. It should restore the last reliable state when practical and offer a clear resume-or-end choice.

Completion messaging:

- Heading: "Focus Session Complete"
- Supporting message: "Your focus session has ended."
- Prompt: "Take a moment to review what you accomplished."

**Acceptance criteria**

- Paused time is excluded from active session time.
- Resuming does not restart the full countdown.
- Tab switching does not pause or reset the timer.
- Early ending and timer completion both lead to reflection.
- The reported active session time does not exceed the planned duration.
- Uncertain time during a browser interruption is not automatically counted.
- Timer completion does not determine task outcome.

### 5.6 Reflection and Session Summary

After a session ends, ask the learner to report the task outcome:

- "Yes, completed."
- "Partly completed."
- "Not completed."

Ask how focused the learner felt:

- "Not very focused."
- "Somewhat focused."
- "Very focused."

Offer an optional reflection about what helped or distracted the learner. Use supportive language such as:

"Not every session goes as planned. What did you learn?"

Encourage a small adjustment for the next session without blaming the learner.

The "Save Reflection" action must save the session and display a summary containing:

- Goal recorded for the session.
- Task.
- Confirmed goal connection.
- Planned duration.
- Actual active session time.
- Reported task outcome.
- Reported focus level.
- Optional reflection and definition of done, when available.

Distinguish clearly between planned duration and active session time. Do not award productivity scores or claim that one session proves lasting improvement.

The summary must offer:

- Primary action: "Plan My Next Session."
- A quieter route back to the saved-goal view.
- An option to finish and leave.

"Plan My Next Session" must retain the current goal and open a fresh task form. It must not start a timer or create a new session automatically.

**Acceptance criteria**

- The learner can select any of the three task outcomes.
- The focus-level response is saved.
- Optional reflection can be omitted.
- The saved summary shows the recorded session information.
- Planning the next session does not change the previous summary.
- The next session does not start automatically.

### 5.7 Past Sessions and History

The history view must show saved sessions in newest-first order.

Each list item must display:

- Task name.
- Session date.
- Planned duration.
- Actual active session time.
- Task outcome.

Selecting a session opens its saved summary and reflection in read-only mode.

The learner must have a clear way to return to the saved-goal view.

**Acceptance criteria**

- Saved sessions appear newest first.
- Each item displays all five required details.
- Opening a past session does not modify its stored information.
- Returning from a past session preserves the history.
- A normal page reload retains saved history in the same browser.
- When history is empty, show: "No sessions saved yet. Your reflections will appear here."

## 6. Persistence and Privacy

FocusFlow is a single-user, browser-local PoC.

Requirements:

- Save the current goal and relevant session records in the current browser.
- Retain saved information across normal page reloads.
- Do not require registration, login, or a backend service.
- Do not synchronize information across devices.
- Do not monitor websites or other applications.
- Do not claim that browser-local information is backed up or permanently recoverable.

Clearing browser data may remove saved information. Data availability on another browser or device is not guaranteed.

The specific storage mechanism, data structure, and recovery behavior are defined in `spec.md`.

**Acceptance criteria**

- Saved goal information survives a normal reload when browser storage remains available.
- Saved session summaries and reflections survive a normal reload.
- No account or cloud synchronization is required.
- Storage errors are handled without falsely confirming that information was saved.

## 7. Interface, Accessibility, and Visual Design

The interface must feel calm, supportive, and focused.

Design requirements:

- Clear typography and readable contrast.
- Comfortable spacing and responsive layouts.
- A visually prominent task and countdown during focus.
- Consistent button labels and understandable navigation.
- Subtle transitions that do not distract from the task.
- Visible validation messages associated with their fields.
- Keyboard-accessible controls and appropriate focus behavior.
- Accessible status messages for important timer and save-state changes.
- No reliance on color alone to communicate errors or status.

Avoid guilt-based language, arbitrary scores, streaks, badges, overwhelming dashboards, unnecessary choices, and distracting animation.

## 8. Error and Recovery States

The app must handle the following situations:

- **Invalid goal:** Show an inline error and preserve other entries.
- **Invalid task or connection:** Keep the learner on the form and prevent the session from starting.
- **Empty history:** Show the neutral empty-state message.
- **Paused session:** Preserve the remaining time and exclude the pause.
- **Interrupted session:** Avoid counting uncertain time and offer a clear recovery choice when practical.
- **Storage unavailable:** Explain that saving or restoring information is unavailable; do not claim success.
- **Timer complete:** Open reflection without assuming task completion.
- **Early session ending:** Open the same reflection flow as normal completion.
- **Past session review:** Keep saved information read-only.

## 9. Scope Boundaries

### Included in the PoC

- First-visit welcome experience.
- Single current goal and goal editing.
- One-task planning and preview.
- Four supported focus durations.
- Focus timer with pause, resume, and early ending.
- Active session time measurement.
- Task outcome and focus-level selection.
- Optional reflection.
- Saved session summaries.
- Newest-first session history.
- Browser-local persistence.
- Accessible validation and recovery behavior.

### Explicitly excluded

- User accounts and authentication.
- Backend services and cloud synchronization.
- Multiple active goals.
- Multiple tasks in one session.
- Task priorities, deadlines, categories, and recurring schedules.
- Website monitoring or application blocking.
- Teams, social features, and shared workspaces.
- Complex analytics, charts, productivity scores, streaks, and badges.
- External AI recommendations.

### Possible future enhancements

Richer progress views or additional coaching may be considered after learner feedback. These are not required for the current PoC.

## 10. Definition of Done

The PoC is ready for demonstration when a learner can complete the core journey:

1. Open the app and understand its purpose.
2. Save a valid long-term goal.
3. Plan one task and review the task details.
4. Run, pause, resume, or end a focus session.
5. Record the task outcome and focus level.
6. Save a reflection and view the session summary.
7. Plan another session without altering the previous one.
8. Review past sessions in read-only mode.
9. Reload the page and recover saved goal and history data in the same browser.

Required-field validation, timer behavior, persistence, history ordering, and interrupted-session handling must be tested. The app must not claim to have saved data when persistence has failed.

## 11. Open Questions and Document Alignment

The browser-local persistence model and conservative interrupted-session recovery behavior are defined in `spec.md > Data Model` and `spec.md > Important Failure Modes`.

The empty-history message is defined in `spec.md > Important Failure Modes`.

If implementation behavior and these requirements differ, record the discrepancy and resolve it deliberately. Do not silently introduce accounts, backend dependencies, or other excluded features to work around an implementation issue.