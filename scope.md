---
doc: scope
status: draft
---

# FocusFlow — Project Scope

FocusFlow is a focus and productivity web application designed to help learners turn their long-term goals into manageable work sessions and track their progress over time.

## The Unique Kernel

FocusFlow brings goal setting, task planning, a focus timer, and progress tracking together in one experience. Instead of only listing work to do, it helps users connect their daily focus to a bigger goal and review the time they invest.

## Who It's For

FocusFlow is designed for students, independent learners, and people developing new skills who want a clearer way to plan their work, reduce distractions, and build consistent study or work habits.

For example, someone learning web development can set a goal, choose a specific task to work on, run a focus session, and review their recorded focus time.

## The Core Loop

1. **Create an account or sign in:** Users can register and sign in to access FocusFlow.
2. **Choose a goal:** Enter a long-term goal that gives direction to the work session.
3. **Plan today's focus:** Choose a task and a focus duration.
4. **Connect the task to the goal:** FocusFlow creates a simple sentence using the user's goal and task. The sentence is rule-based, not AI-generated.
5. **Start focusing:** Use the focus timer to work for the selected duration.
6. **Review progress:** Completed focus sessions contribute to recorded focus history and progress summaries.
7. **Continue improving:** Review available focus statistics and adjust the focus-time target.

## What Makes It Useful

FocusFlow aims to make personal progress easier to see. Users can review focus time, completed sessions, progress toward a chosen focus-time target, and weekly focus insights based on recorded sessions.

These measurements describe recorded activity. They do not prove that a person was continuously concentrating or guarantee long-term improvement.

## Current Product Scope

The project includes the following areas:

- **Account access:** Registration and sign-in screens connected to a backend.
- **Goal and task planning:** A form for entering a long-term goal, a task, and a focus duration.
- **Goal-task connection:** A sentence created from the user's own goal and task text.
- **Focus timer:** A timer interface for a planned focus session.
- **Goal journey:** A progress section showing recorded focus time, completed sessions, a focus-time target, and milestones.
- **Weekly focus insights:** A summary of recorded focus activity during the week.
- **Session history:** Browser-stored records used to display past focus activity.
- **Responsive interface:** A styled web interface intended to support everyday use.

Feature availability and persistence should be verified against the current implementation before making claims about production readiness.

## Technical Direction

FocusFlow uses a JavaScript-based frontend and a Node.js/Express backend. The backend connects to MongoDB for account-related data and provides API routes for authentication and tasks. The frontend also uses browser local storage for certain focus-session details, history, and focus-time settings.

Account data and browser-stored focus data are separate. Browser-stored information should not be described as automatically synchronized between devices unless that behavior is implemented and tested.

## Inspiration & Identity

The intended experience is calm, modern, encouraging, and easy to navigate. The interface should help users concentrate on their next action and understand their progress without overwhelming them with unnecessary information.

## What Success Looks Like

A useful demonstration should show a user registering or signing in, entering a goal and task, selecting a focus duration, using the timer, and viewing the progress information available in the application.

Testing should also verify that authentication errors are handled clearly, saved information behaves as expected, and the main user journey works without browser-console or server errors.

Feedback from learners can help determine whether the workflow makes planning and reviewing focus sessions easier. A successful demo is not proof of improved productivity over the long term.

## Later Enhancements

Possible future improvements include stronger synchronization of session history across devices, more detailed progress reports, improved task-management workflows, and additional guidance for planning focused work.

These improvements should only be added when they address real user needs and can be tested reliably.

## Explicitly Out of Scope

- Claims that FocusFlow can guarantee concentration or eliminate distractions.
- Claims that recorded timer activity proves continuous attention.
- Claims that the goal-task sentence understands meaning through AI.
- Claims of cross-device synchronization for information stored only in the browser.
- Claims that the application is production-ready or fully tested without supporting verification.

## Project Principle

**Small steps. Real progress.**

FocusFlow helps users make their work more intentional and their recorded progress easier to review.
