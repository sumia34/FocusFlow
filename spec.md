---
doc: spec
status: approved
---

# FocusFlow — Technical Specification

## 1. Purpose

This document describes the technical approach for implementing FocusFlow according to the approved requirements in `prd.md` and the boundaries in `scope.md`.

FocusFlow is a small, single-user focus-planning website. A learner records one long-term goal, plans one task, completes a timed focus session, reflects on the result, and reviews previous sessions.

The application runs in a browser and stores its data locally. It does not require user accounts, an application backend, a database, cloud synchronization, an AI service, or a paid service.

**Important:** This specification describes the intended design. Existing source code must be inspected and tested before claiming every feature has been implemented.

## 2. Technical Approach in Plain Language

FocusFlow uses HTML, CSS, and JavaScript. Vite serves the application locally during development and creates a static production build.

The browser's `localStorage` stores the learner's goal and saved sessions. This storage belongs to the current browser and website origin. It is not cloud storage, and clearing browser data can remove saved information.

When the learner plans a task, JavaScript creates an editable sentence connecting the task to the learner's goal. The application uses a simple text template; it does not use AI or attempt to determine whether the connection is meaningful.

The focus timer uses timestamps rather than relying on counting one-second timer ticks. This helps it calculate elapsed time when browser updates are delayed.

The application should save timer checkpoints while a session is running and at important transitions. Browser throttling or an unexpected shutdown can prevent the most recent checkpoint from being saved. After an interruption, the application must use only the last successfully saved checkpoint and explain that some time may be uncounted.

Automated tests use Node.js's built-in test runner for focused logic. Manual browser testing verifies forms, navigation, timer behavior, persistence, and recovery.

## 3. Technology Stack

- **HTML:** Application page structure.
- **CSS:** Layout, typography, responsive behavior, and accessible visual states.
- **JavaScript ES modules:** Application behavior and reusable logic.
- **Vite:** Local development server and static production build tool.
- **Browser `localStorage`:** Local persistence for the current goal, active session, and saved sessions.
- **Node.js and npm:** Development commands and automated tests.
- **Node.js built-in test runner:** Focused tests using `node:test` and `node:assert/strict`.

No React, Express, MongoDB, authentication service, external AI API, analytics service, or runtime cloud service is required.

Useful documentation:

- [Vite Guide](https://vite.dev/guide/)
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Node.js Test Runner](https://nodejs.org/api/test.html)

Use a Node.js version compatible with the installed Vite release. Confirm the required version from the package metadata before installation or upgrading dependencies.

## 4. Application Flow

The core journey follows the approved requirements in `prd.md`.

1. The browser loads `index.html`.
2. The JavaScript entry point initializes the application.
3. The application reads locally saved data.
4. If no goal exists, it displays the welcome and goal setup flow.
5. The learner saves a goal and sees the saved-goal view.
6. The learner plans one task, chooses an allowed duration, and reviews or edits the suggested goal connection.
7. Starting the session creates an active timer session.
8. The learner may pause, resume, or end the session early.
9. When the session ends, the learner records an outcome, focus level, and optional reflection.
10. Saving the reflection creates a saved session and displays its summary.
11. The learner can plan another session, return to the goal view, or review past sessions.
12. Reloading the application restores saved data from the same browser, subject to storage availability and the last successful timer checkpoint.

A completed timer does not automatically mean that the learner completed the task.

## 5. Project Structure

The intended project structure is:

```text
FocusFlow/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
├── scope.md
├── prd.md
├── spec.md
├── src/
│   ├── main.js
│   ├── app.js
│   ├── connection.js
│   ├── session-timer.js
│   ├── storage.js
│   └── styles.css
└── tests/
    ├── connection.test.js
    ├── session-timer.test.js
    └── storage.test.js
```

This is the target structure, not a claim that every listed file already exists. Keep the actual project structure consistent with the implementation. Do not create duplicate modules merely to match this example if the current application uses a different organization; update this specification to match any approved implementation decision.

The `learner-profile.me` file, if present, is local project context and should not be renamed or included in public commits without reviewing its contents.

## 6. Module Responsibilities

### `index.html` — Application shell

Provides the HTML document and an accessible mount point for the application.

### `src/main.js` — Application entry point

Loads the application stylesheet and initializes the app. It should report initialization failures clearly rather than leaving the page blank without an explanation.

### `src/app.js` — Screens and user flow

Coordinates the welcome screen, goal form, saved-goal view, task planning, focus timer, reflection, session summary, and history.

It handles navigation, form validation, and screen updates. Timer calculations and storage operations should be delegated to their respective modules when those modules are present.

Validation errors should be visible, associated with the relevant fields, and should not unnecessarily erase the learner's existing input.

### `src/connection.js` — Goal-connection suggestion

Provides a simple, deterministic function that creates the following editable default sentence:

`I chose “[task]” because it can help me make progress toward “[goal].”`

The function uses the learner's actual task and goal text. It does not infer meaning or use an external service.

Missing required values must be handled by validation rather than converted into misleading sentence text.

### `src/session-timer.js` — Timer calculations and recovery

Keeps timer calculations separate from interface updates.

The intended behavior is to:

- Calculate elapsed and remaining time from timestamps.
- Count only known running intervals.
- Exclude recorded pauses.
- Support pause, resume, completion, and early ending.
- Cap active time at the planned session duration.
- Support restoration from the latest successfully persisted checkpoint.
- Keep a hidden tab running rather than treating tab switching as a pause.

### `src/storage.js` — Local persistence

Manages reading, validating, and writing application data to `localStorage`.

The intended responsibilities include:

- Saving and retrieving the current goal.
- Saving completed sessions.
- Persisting the active session and timer checkpoint.
- Preserving goal and task snapshots in saved sessions.
- Handling unavailable storage and failed writes.
- Avoiding silent replacement of malformed or recoverable saved data with empty defaults.

If the existing project combines storage and application logic in another module, document the actual design rather than creating conflicting implementations.

### `src/styles.css` — Visual styling

Provides the visual system for the application, including forms, validation messages, focus states, the timer, session summaries, history, and responsive layouts.

### `tests/` — Automated checks

The target test suite uses Node.js's built-in test runner. Tests should use controlled timestamps and isolated storage substitutes where appropriate.

- `connection.test.js`: sentence generation and missing-input handling.
- `session-timer.test.js`: elapsed time, pause/resume, time limits, and interrupted-session recovery.
- `storage.test.js`: serialization, validation, and goal/session persistence.

Test files must match the modules that actually exist in the repository.

## 7. Data Model

The intended storage design is a versioned application data object saved under one app-specific `localStorage` key.

The object contains:

- A schema version.
- The current goal, or no goal.
- A collection of saved sessions.
- The active session, or no active session.

### Goal

The goal record contains:

- Goal text.
- Optional motivation.
- Optional description of what progress would look like.
- Last-updated timestamp.

### Active session

The active session contains the information needed to resume or end a session safely:

- Unique session identifier.
- Snapshot of the goal and task.
- Confirmed goal-connection sentence.
- Optional description of what counts as done.
- Planned duration.
- Accumulated active time.
- Running or paused status.
- Start time of the current running interval, when applicable.
- Last successfully persisted checkpoint.
- Pause/resume timing information required by the implementation.

### Saved session

A saved session contains:

- Session identifier.
- Goal and task snapshots.
- Confirmed goal-connection sentence.
- Optional description of what counts as done.
- Planned duration.
- Actual active session time.
- Learner-selected task outcome.
- Learner-selected focus level.
- Optional reflection.
- Session date and time.

Saving a reflection moves the active session into the saved-session collection and clears the active-session slot. Past sessions are displayed read-only and sorted newest first.

Editing the current goal must not rewrite the goal snapshots in previous sessions.

The exact property names and serialization format must be defined consistently in the source code and tests.

## 8. Timer and Recovery Rules

### Timestamp-based timing

Timer calculations must use timestamps, not the number of interval callbacks received. Browser scheduling can delay callbacks, especially when a tab is hidden or the computer is under load.

While the session is running, the interface should recalculate its display from timestamps. Switching tabs must not pause the session.

### Pause and resume

Pausing ends the current running interval and records its known active time. Resuming starts a new running interval.

Paused time must not count toward active session time.

### Completion and early ending

When the planned duration is reached, the session proceeds to reflection. If the learner ends early, the application records only the known active time.

The application must not automatically select a positive task outcome just because the timer reached zero.

### Checkpointing

The application should attempt to save checkpoints periodically while running and immediately at important transitions, including pause, resume, completion, early ending, and page exit.

Checkpoint writes are best-effort. Browser throttling, storage failures, and abrupt shutdown can prevent a write.

### Interrupted sessions

When a running session is restored after a reload or browser closure:

1. Read the latest successfully persisted checkpoint.
2. Do not count the uncertain period after that checkpoint.
3. Explain that some time may be uncounted.
4. Offer the learner a choice to resume or end the session.
5. If resumed, start a new running interval at the current time.
6. If ended, save only the known active time before continuing to reflection.

If the last checkpoint was paused, restore the session as paused.

Never invent active time to compensate for a missing checkpoint. Actual active time must never exceed the planned duration.

## 9. Persistence, Privacy, and Failure Handling

FocusFlow is browser-local and single-user.

- No registration or login is required.
- No application backend or cloud synchronization is used.
- Data remains in the browser's storage for the current site origin.
- A different browser or device has separate data.
- Clearing site data may permanently remove the saved goal and session history.
- The application must not claim that data was saved if a storage write failed.

### Malformed or corrupted data

The application must validate stored data before relying on it.

If the stored value is malformed or cannot be safely interpreted:

- Do not silently overwrite it with an empty default.
- Preserve the original value while presenting a clear recovery message.
- Do not silently discard recoverable session history.
- Avoid further writes that could destroy recoverable information until the data can be handled safely.

### Unavailable storage

If browser storage is unavailable or a write fails, explain that information may not have been saved. Do not display a false success message.

### Empty states

When there is no saved goal, show the welcome and goal setup flow.

When there are no saved sessions, show:

“No sessions yet. Your saved sessions will appear here.”

## 10. User Interface and Accessibility

Implement the visual direction described in `prd.md`:

- A light, uncluttered layout.
- Readable system sans-serif typography.
- Comfortable spacing and clear visual hierarchy.
- Dark, high-contrast text.
- Restrained muted green or blue accents.
- A prominent, easy-to-read countdown during focus sessions.
- Clear focus indicators for keyboard users.
- Inline errors associated with their relevant form fields.
- Responsive layouts for different screen sizes.
- Supportive, nonjudgmental language.

Use subtle transitions only where they improve the experience. Avoid external font or image dependencies.

Do not add scores, streaks, productivity rankings, surveillance, or claims that tracked time proves concentration.

## 11. Dependencies and Commands

The intended setup uses npm with Vite as a development dependency and ES modules enabled.

The `package.json` should provide these scripts:

- `dev`: start the Vite development server.
- `test`: run the automated tests with `node --test`.
- `build`: generate the static production build with Vite.

The lockfile should record the resolved dependency versions.

From the project directory, use:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

Keep the terminal running while using the development server.

Run the automated tests with:

```sh
npm test
```

Check the production build with:

```sh
npm run build
```

These commands are expected to work only after the corresponding scripts, dependencies, and tests have been implemented correctly. Verify them in the actual project instead of assuming they already pass.

## 12. Manual Acceptance Checks

Verify the following behaviors in the browser in addition to automated tests.

### Goal setup

- Save a goal with the optional fields left empty.
- Submit an empty goal and confirm that validation prevents saving.
- Confirm that validation does not unnecessarily erase other entered values.
- Edit the current goal and verify that previously saved session snapshots remain unchanged.

### Task planning

- Enter a task and choose an allowed duration.
- Confirm that the goal-connection sentence uses the learner's actual text.
- Edit the sentence and confirm that the edited version appears in the preview and saved session.
- Confirm that missing required task or connection text prevents the session from starting.

### Focus timer

- Start a session and verify that its task, connection, and countdown are visible.
- Switch tabs and return; verify that the countdown catches up.
- Pause, wait, and resume; verify that paused time is excluded.
- End a session early and verify that only known active time is recorded.
- Allow a session to reach zero and verify that reflection follows without automatically marking the task completed.

### Reflection and history

- Save a reflection and verify that the summary displays the planned duration, actual active time, selected outcome, focus level, and reflection.
- Plan another session and confirm that the saved goal remains available.
- Reload the application and confirm that the goal and saved sessions remain available.
- Open history and verify that sessions appear newest first.
- Open an old summary and confirm that its details remain read-only.

### Recovery and errors

- Reload while a session is running and verify that recovery uses the last successfully persisted checkpoint.
- Confirm that uncertain time is excluded and the learner is offered the choice to resume or end.
- Simulate malformed stored data and verify that the application does not silently replace it with empty data.
- Simulate unavailable storage or a failed write and verify that the application does not falsely claim that data was saved.

## 13. Scope Boundaries

The implementation must preserve the approved product scope.

Included:

- One long-term goal.
- One task per focus session.
- A suggested but editable goal-connection sentence.
- Supported focus durations.
- Start, pause, resume, and early-end controls.
- Reflection after a session.
- A saved session summary.
- Read-only past-session history.
- Browser-local persistence.
- Honest handling of timer interruptions and storage failures.

Excluded from this MVP:

- User registration and login.
- A backend API or database.
- Cloud synchronization and cross-device recovery.
- AI-generated task recommendations.
- Multiple-goal management or a full task manager.
- Social features, public profiles, and leaderboards.
- Productivity scores, streak pressure, or user monitoring.
- Required hosting or deployment.

The public repository and short demo video are hackathon deliverables. A deployed URL is optional unless the challenge's separate submission rules require one.

## 14. Decisions and Remaining Verification

Approved technical decisions:

- HTML, CSS, and JavaScript ES modules.
- Vite for local development and static builds.
- Browser-local persistence without accounts or cloud synchronization.
- A rule-based, editable goal-connection sentence.
- Timestamp-based timer calculations.
- Best-effort checkpoints and conservative interruption recovery.
- Focused automated tests plus manual browser verification.

Implementation details to verify:

- Confirm the actual Node.js and npm versions.
- Confirm the installed Vite version and its supported Node.js versions.
- Confirm the real file structure and npm scripts.
- Confirm that storage, timer, connection, and UI responsibilities match the implemented modules.
- Confirm that the automated tests and production build run successfully.
- Ensure the final implementation agrees with `prd.md` and `scope.md`.

Do not claim a requirement is complete until the relevant source code or test demonstrates it.
