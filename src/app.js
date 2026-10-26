
import { createConnectionSentence } from './connection.js';
import { loadFocusDraft, saveFocusDraft } from './storage.js';

const HISTORY_KEY = 'focusflow_session_history_v1';
const TARGET_KEY = 'focusflow_goal_target_hours_v1';
const MAX_HISTORY_ITEMS = 200;

export function renderApp() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="page-shell ff-premium">
      <header class="site-header">
        <a class="brand" href="#top" aria-label="FocusFlow home">
          <span class="brand-mark">F</span>
          <span>FocusFlow<span class="brand-dot">.</span></span>
        </a>
        <div class="header-status">
          <span class="status-dot"></span>
          YOUR SPACE TO FOCUS
        </div>
      </header>

      <main id="top">
        <section class="intro premium-intro">
          <p class="eyebrow">LESS NOISE. MORE MEANING.</p>
          <h1>Big goals start with<br /><span>one focused moment.</span></h1>
          <p class="intro-copy">
            Turn the time you invest today into visible progress toward what matters.
          </p>
        </section>

        <section class="journey-panel" aria-labelledby="journey-title">
          <div class="journey-top">
            <div>
              <p class="eyebrow">YOUR BIGGER PICTURE</p>
              <h2 id="journey-title">Goal Journey</h2>
              <p class="journey-subtitle">
                Every completed session adds real time to your journey.
              </p>
            </div>
            <span class="journey-icon" aria-hidden="true">✦</span>
          </div>

          <div class="journey-goal" id="journey-goal">
            Your goal will appear here when you save today's focus.
          </div>

          <div class="journey-stats">
            <div class="journey-stat">
              <span class="stat-label">FOCUS TIME INVESTED</span>
              <strong id="journey-minutes">0 min</strong>
            </div>
            <div class="journey-stat">
              <span class="stat-label">SESSIONS COMPLETED</span>
              <strong id="journey-sessions">0</strong>
            </div>
            <div class="journey-stat">
              <span class="stat-label">TIME TARGET</span>
              <strong id="journey-target-label">5 hours</strong>
            </div>
          </div>

          <div class="journey-progress-heading">
            <span>Progress toward your focus-time target</span>
            <strong id="journey-percent">0%</strong>
          </div>
          <div
            class="journey-progress-track"
            id="journey-progress-track"
            role="progressbar"
            aria-label="Focus time target progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
          >
            <div class="journey-progress-fill" id="journey-progress-fill"></div>
          </div>
          <p class="journey-footnote" id="journey-footnote">
            Complete a focus session to start building your journey.
          </p>

          <div class="target-controls">
            <label for="target-hours">Set your focus-time target</label>
            <select id="target-hours">
              <option value="1">1 hour</option>
              <option value="5" selected>5 hours</option>
              <option value="10">10 hours</option>
              <option value="20">20 hours</option>
              <option value="40">40 hours</option>
            </select>
          </div>

          <div class="milestone-heading">
            <h3>Your journey milestones</h3>
            <span id="milestone-count">0 sessions</span>
          </div>
          <div class="milestone-list" id="milestone-list">
            <p class="journey-empty">
              Your completed sessions will appear here as milestones.
            </p>
          </div>
        </section>

        <section class="weekly-panel" aria-labelledby="weekly-title">
          <div class="weekly-heading">
            <div>
              <p class="eyebrow">YOUR CONSISTENCY, MADE VISIBLE</p>
              <h2 id="weekly-title">Weekly Focus Insights</h2>
              <p class="weekly-subtitle">Your progress from Monday through Sunday.</p>
            </div>
            <span class="weekly-icon" aria-hidden="true">↗</span>
          </div>

          <div class="weekly-stats">
            <article class="weekly-stat">
              <span>Total focus time</span>
              <strong id="weekly-minutes">0 min</strong>
            </article>
            <article class="weekly-stat">
              <span>Sessions completed</span>
              <strong id="weekly-sessions">0</strong>
            </article>
            <article class="weekly-stat">
              <span>Most productive day</span>
              <strong id="weekly-best-day">No data yet</strong>
            </article>
          </div>

          <h3 class="weekly-chart-title">Daily focus time</h3>
          <div
            class="weekly-chart"
            id="weekly-chart"
            role="img"
            aria-label="Daily focus minutes this week"
          ></div>
          <p class="weekly-footnote" id="weekly-footnote">
            Complete a focus session to start building your weekly insights.
          </p>
        </section>

        <div class="workspace">
          <section class="planning-panel" aria-labelledby="planning-title">
            <div class="section-heading">
              <div>
                <p class="eyebrow">START WITH INTENTION</p>
                <h2 id="planning-title">Shape today's focus</h2>
              </div>
              <span class="step-mark">01</span>
            </div>

            <div class="field-group">
              <label for="goal-input">Your long-term goal</label>
              <input
                id="goal-input"
                name="goal"
                type="text"
                required
                autocomplete="off"
                placeholder="e.g., Become a web developer"
                aria-describedby="goal-hint goal-error"
              />
              <p class="field-hint" id="goal-hint">
                Pick something that matters to you.
              </p>
              <p class="field-error" id="goal-error" hidden></p>
            </div>

            <div class="field-group">
              <label for="duration-input">How long will you focus?</label>
              <select id="duration-input" name="duration">
                <option value="15">15 minutes</option>
                <option value="25" selected>25 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
              </select>
              <p class="field-hint">
                Choose a realistic amount of time for your task.
              </p>
            </div>

            <div class="field-group">
              <label for="task-input">One task for today</label>
              <input
                id="task-input"
                name="task"
                type="text"
                required
                autocomplete="off"
                placeholder="e.g., Practise JavaScript functions"
                aria-describedby="task-hint task-error"
              />
              <p class="field-hint" id="task-hint">
                Make it specific and small enough to begin.
              </p>
              <p class="field-error" id="task-error" hidden></p>
            </div>

            <div class="connection-panel">
              <div class="connection-heading">
                <span class="connection-symbol">↗</span>
                <div>
                  <h3>Why this step matters</h3>
                  <p id="connection-hint">
                    Connect today's action to your bigger goal.
                  </p>
                </div>
              </div>

              <label class="visually-hidden" for="connection-input">
                Connection between your task and goal
              </label>
              <textarea
                id="connection-input"
                name="connection"
                rows="3"
                required
                placeholder="Your goal and task will come together here."
                aria-describedby="connection-hint connection-error"
              ></textarea>
              <p class="field-error" id="connection-error" hidden></p>
            </div>

            <button class="primary-button" id="save-focus" type="button">
              Save today's focus
            </button>

            <p class="save-feedback" id="save-feedback" role="status" aria-live="polite"></p>

            <section class="today-card" id="today-card" hidden aria-labelledby="today-card-title">
              <p class="eyebrow">YOUR NEXT MEANINGFUL STEP</p>
              <h2 id="today-card-title">Today's focus</h2>
              <p class="today-task" id="saved-task-title"></p>
              <div class="today-card-detail">
                <span class="detail-label">BIGGER GOAL</span>
                <p id="saved-task-goal"></p>
              </div>
              <div class="today-card-detail">
                <span class="detail-label">WHY IT MATTERS</span>
                <p id="saved-task-connection"></p>
              </div>
              <p class="today-duration" id="saved-task-duration"></p>
            </section>

            <p class="privacy-note">
              Your focus details and history are stored in this browser.
            </p>
          </section>

          <aside class="support-column" aria-label="Focus timer and history">
            <section class="timer-panel" aria-labelledby="timer-title">
              <div class="panel-topline">
                <p class="eyebrow">PROTECT YOUR ATTENTION</p>
                <span class="preview-tag">FOCUS MODE</span>
              </div>
              <h2 id="timer-title">One thing at a time.</h2>
              <p class="timer-caption">
                You don't need to finish everything. Just begin.
              </p>

              <div class="timer-orbit">
                <div
                  class="timer-display"
                  id="timer-display"
                  role="timer"
                  aria-live="off"
                  aria-label="25 minutes remaining"
                >25:00</div>
                <span class="timer-orbit-label">STAY WITH IT</span>
              </div>

              <p class="timer-status" id="timer-status" role="status" aria-live="polite">
                Ready when you are.
              </p>

              <div class="timer-controls">
                <button class="primary-button" id="start-timer" type="button">
                  Start Focus
                </button>
                <button class="timer-control-button" id="pause-timer" type="button" disabled>
                  Pause
                </button>
                <button class="timer-control-button" id="reset-timer" type="button">
                  Reset
                </button>
              </div>
              <p class="timer-small-note">Your session counts when the timer reaches zero.</p>
            </section>

            <section class="reflection-panel" id="reflection-panel" hidden aria-labelledby="reflection-title">
              <p class="eyebrow">CLOSE THE LOOP</p>
              <h2 id="reflection-title">Take a moment to reflect.</h2>
              <p class="reflection-intro">
                A completed session is progress. Capture what you learned before moving on.
              </p>

              <form id="reflection-form">
                <div class="field-group">
                  <label for="reflection-accomplishment">What did you accomplish?</label>
                  <textarea
                    id="reflection-accomplishment"
                    rows="3"
                    placeholder="Describe what you worked on or achieved..."
                  ></textarea>
                </div>

                <div class="field-group">
                  <label for="reflection-challenge">What distracted or challenged you?</label>
                  <textarea
                    id="reflection-challenge"
                    rows="3"
                    placeholder="Note anything that made focusing difficult..."
                  ></textarea>
                </div>

                <div class="field-group">
                  <label for="reflection-next-step">What's your next step?</label>
                  <textarea
                    id="reflection-next-step"
                    rows="3"
                    placeholder="Choose one action for next time..."
                  ></textarea>
                </div>

                <p class="reflection-feedback" id="reflection-feedback" role="status" aria-live="polite"></p>

                <div class="reflection-actions">
                  <button class="primary-button" type="submit" id="save-reflection">
                    Save reflection
                  </button>
                  <button class="timer-control-button" type="button" id="close-reflection">
                    Close
                  </button>
                </div>
              </form>
            </section>

            <section class="history-panel" aria-labelledby="history-title">
              <div class="history-heading">
                <div>
                  <p class="eyebrow">YOUR EFFORT, REMEMBERED</p>
                  <h2 id="history-title">Past sessions</h2>
                </div>
                <span class="history-count" id="history-count" aria-label="0 completed sessions">0</span>
              </div>
              <p class="empty-history" id="empty-history">
                Your first completed session will show up here.
              </p>
              <div class="session-list" id="session-list" aria-live="polite"></div>
            </section>
          </aside>
        </div>
      </main>

      <footer class="site-footer">
        <span>Small steps. Real time. Meaningful progress.</span>
        <span class="footer-mark">FOCUSFLOW / 01</span>
      </footer>
    </div>
  `;

  const $ = (selector) => app.querySelector(selector);

  const goalInput = $('#goal-input');
  const taskInput = $('#task-input');
  const durationInput = $('#duration-input');
  const connectionInput = $('#connection-input');
  const saveButton = $('#save-focus');
  const feedback = $('#save-feedback');

  const timerDisplay = $('#timer-display');
  const startTimerButton = $('#start-timer');
  const pauseTimerButton = $('#pause-timer');
  const resetTimerButton = $('#reset-timer');
  const timerStatus = $('#timer-status');

  const todayCard = $('#today-card');
  const savedTaskTitle = $('#saved-task-title');
  const savedTaskGoal = $('#saved-task-goal');
  const savedTaskConnection = $('#saved-task-connection');
  const savedTaskDuration = $('#saved-task-duration');

  const historyCount = $('#history-count');
  const emptyHistory = $('#empty-history');
  const sessionList = $('#session-list');

  const targetHoursInput = $('#target-hours');
  const journeyGoal = $('#journey-goal');
  const journeyMinutes = $('#journey-minutes');
  const journeySessions = $('#journey-sessions');
  const journeyTargetLabel = $('#journey-target-label');
  const journeyPercent = $('#journey-percent');
  const journeyProgressTrack = $('#journey-progress-track');
  const journeyProgressFill = $('#journey-progress-fill');
  const journeyFootnote = $('#journey-footnote');
  const milestoneCount = $('#milestone-count');
  const milestoneList = $('#milestone-list');
  
  const weeklyMinutes = $('#weekly-minutes');
  const weeklySessions = $('#weekly-sessions');
  const weeklyBestDay = $('#weekly-best-day');
  const weeklyChart = $('#weekly-chart');
  const weeklyFootnote = $('#weekly-footnote');


  const reflectionPanel = $('#reflection-panel');
  const reflectionForm = $('#reflection-form');
  const reflectionAccomplishment = $('#reflection-accomplishment');
  const reflectionChallenge = $('#reflection-challenge');
  const reflectionNextStep = $('#reflection-next-step');
  const reflectionFeedback = $('#reflection-feedback');
  const saveReflectionButton = $('#save-reflection');
  const closeReflectionButton = $('#close-reflection');

  const fields = [
    {
      input: goalInput,
      error: $('#goal-error'),
      message: 'Enter a goal you would like to work toward.',
    },
    {
      input: taskInput,
      error: $('#task-error'),
      message: 'Describe one specific task you want to work on.',
    },
    {
      input: connectionInput,
      error: $('#connection-error'),
      message: 'Explain how this task supports your goal.',
    },
  ];

  let remainingSeconds = Number(durationInput.value) * 60;
  let timerInterval = null;
  let lastSuggestion = '';
  let storageIsReadable = true;
  let activeSessionFocus = null;
  let sessionHistory = [];
  let targetHours = 5;
  let activeReflectionSessionId = null;

  function renderTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    timerDisplay.textContent =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    timerDisplay.setAttribute(
      'aria-label',
      `${minutes} minutes and ${seconds} seconds remaining`
    );
  }

  function renderTimerPreview(minutes) {
    remainingSeconds = Number(minutes) * 60;
    renderTimerDisplay();
  }

  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimerState() {
    stopTimer();
    activeSessionFocus = null;
    renderTimerPreview(durationInput.value);

    timerStatus.textContent = 'Ready when you are.';
    startTimerButton.textContent = 'Start Focus';
    startTimerButton.disabled = false;
    pauseTimerButton.disabled = true;
  }

  function readSessionHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((session) =>
          session &&
          typeof session.task === 'string' &&
          typeof session.goal === 'string' &&
          typeof session.connection === 'string' &&
          Number.isFinite(session.duration) &&
          Number.isFinite(session.completedAt)
        )
        .slice(0, MAX_HISTORY_ITEMS)
        .map((session) => ({
          ...session,
          id: session.id || `session-${session.completedAt}`,
          reflection: {
            accomplishment: session.reflection?.accomplishment || '',
            challenge: session.reflection?.challenge || '',
            nextStep: session.reflection?.nextStep || '',
          },
        }));
    } catch (error) {
      console.error('Could not read session history:', error);
      return [];
    }
  }

  function persistSessionHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(sessionHistory));
      return true;
    } catch (error) {
      console.error('Could not save session history:', error);
      return false;
    }
  }

  function readTargetHours() {
    try {
      const savedTarget = Number(localStorage.getItem(TARGET_KEY));
      const allowed = [1, 5, 10, 20, 40];

      return allowed.includes(savedTarget) ? savedTarget : 5;
    } catch (error) {
      console.error('Could not read focus target:', error);
      return 5;
    }
  }

  function getCurrentGoal() {
    return goalInput.value.trim();
  }

  function getGoalSessions(goal) {
    const normalizedGoal = goal.trim().toLocaleLowerCase();

    if (!normalizedGoal) return [];

    return sessionHistory.filter(
      (session) =>
        session.goal.trim().toLocaleLowerCase() === normalizedGoal
    );
  }

  function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;

    return `${hours}h ${minutes}m`;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return 'Completed session';

    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  function hasReflection(session) {
    const reflection = session.reflection || {};

    return Boolean(
      reflection.accomplishment?.trim() ||
      reflection.challenge?.trim() ||
      reflection.nextStep?.trim()
    );
  }

  function renderWeeklyInsights() {
    const now = new Date();

    // Start the week on Monday, using the user's local calendar.
    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const dayOfWeek = monday.getDay();
    monday.setDate(monday.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyMinutes = Array(7).fill(0);
    const dailySessions = Array(7).fill(0);

    const thisWeek = sessionHistory.filter((session) => {
      const date = new Date(session.completedAt);
      return date >= monday && date < nextMonday;
    });

    for (const session of thisWeek) {
      const date = new Date(session.completedAt);
      const jsDay = date.getDay();
      const index = jsDay === 0 ? 6 : jsDay - 1;

      dailyMinutes[index] += session.duration;
      dailySessions[index] += 1;
    }

    const totalMinutes = dailyMinutes.reduce((sum, value) => sum + value, 0);
    const totalSessions = thisWeek.length;
    const maxMinutes = Math.max(...dailyMinutes, 1);

    weeklyMinutes.textContent = formatMinutes(totalMinutes);
    weeklySessions.textContent = String(totalSessions);

    const bestIndex = dailyMinutes.indexOf(maxMinutes);
    const hasFocusTime = totalMinutes > 0;

    weeklyBestDay.textContent = hasFocusTime
      ? days[bestIndex]
      : 'No data yet';

    weeklyChart.replaceChildren();

    days.forEach((day, index) => {
      const column = document.createElement('div');
      column.className = 'weekly-day';

      const value = document.createElement('span');
      value.className = 'weekly-day-value';
      value.textContent = dailyMinutes[index] > 0
        ? `${dailyMinutes[index]}m`
        : '—';

      const track = document.createElement('div');
      track.className = 'weekly-bar-track';

      const bar = document.createElement('div');
      bar.className = 'weekly-bar';
      bar.style.height = dailyMinutes[index] > 0
        ? `${Math.max(8, (dailyMinutes[index] / maxMinutes) * 100)}%`
        : '0%';

      bar.title = `${day}: ${dailyMinutes[index]} focus minutes, ${dailySessions[index]} sessions`;

      track.append(bar);

      const label = document.createElement('span');
      label.className = 'weekly-day-label';
      label.textContent = day;

      column.append(value, track, label);
      weeklyChart.append(column);
    });

    weeklyFootnote.textContent = totalSessions > 0
      ? `You've completed ${totalSessions} ${
          totalSessions === 1 ? 'session' : 'sessions'
        } this week, investing ${formatMinutes(totalMinutes)} in your goals.`
      : 'No completed sessions this week yet. Finish a focus timer to see your progress here.';
  }

  function renderGoalJourney() {
    const goal = getCurrentGoal();
    const matchingSessions = getGoalSessions(goal);
    const totalMinutes = matchingSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    const targetMinutes = targetHours * 60;
    const percent = Math.min(
      100,
      Math.round((totalMinutes / targetMinutes) * 100)
    );

    journeyGoal.textContent = goal
      ? goal
      : 'Save a long-term goal to start your journey.';

    journeyMinutes.textContent = formatMinutes(totalMinutes);
    journeySessions.textContent = String(matchingSessions.length);
    journeyTargetLabel.textContent =
      `${targetHours} ${targetHours === 1 ? 'hour' : 'hours'}`;

    journeyPercent.textContent = `${percent}%`;
    journeyProgressFill.style.width = `${percent}%`;
    journeyProgressTrack.setAttribute('aria-valuenow', String(percent));

    if (!goal) {
      journeyFootnote.textContent =
        'Enter and save your goal to connect completed sessions to it.';
    } else if (totalMinutes === 0) {
      journeyFootnote.textContent =
        'No completed sessions for this goal yet. Your progress starts when a timer finishes.';
    } else if (totalMinutes >= targetMinutes) {
      journeyFootnote.textContent =
        'Focus-time target reached! You can raise your target or keep building your habit.';
    } else {
      journeyFootnote.textContent =
        `${formatMinutes(targetMinutes - totalMinutes)} of focused time remaining to reach your target.`;
    }

    milestoneCount.textContent =
      `${matchingSessions.length} ${matchingSessions.length === 1 ? 'session' : 'sessions'}`;

    milestoneList.replaceChildren();

    if (matchingSessions.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'journey-empty';
      empty.textContent = goal
        ? 'Your first completed session for this goal will become your first milestone.'
        : 'Your completed sessions will appear here as milestones.';
      milestoneList.append(empty);
      return;
    }

    for (const session of matchingSessions.slice(0, 5)) {
      const item = document.createElement('article');
      item.className = 'milestone-item';

      const marker = document.createElement('span');
      marker.className = 'milestone-marker';
      marker.textContent = '✓';
      marker.setAttribute('aria-hidden', 'true');

      const body = document.createElement('div');
      body.className = 'milestone-body';

      const task = document.createElement('h4');
      task.textContent = session.task;

      const meta = document.createElement('p');
      meta.textContent =
        `${session.duration} minutes · ${formatDate(session.completedAt)}`;

      body.append(task, meta);
      item.append(marker, body);
      milestoneList.append(item);
    }
  }

  function renderReflectionDetails(container, session) {
    const reflection = session.reflection || {};
    const entries = [
      ['What you accomplished', reflection.accomplishment],
      ['What challenged you', reflection.challenge],
      ['Your next step', reflection.nextStep],
    ].filter(([, answer]) => answer && answer.trim());

    if (entries.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'saved-reflection';

    const heading = document.createElement('h4');
    heading.textContent = 'Session reflection';
    wrapper.append(heading);

    for (const [label, answer] of entries) {
      const entry = document.createElement('div');
      entry.className = 'saved-reflection-entry';

      const title = document.createElement('strong');
      title.textContent = label;

      const text = document.createElement('p');
      text.textContent = answer;

      entry.append(title, text);
      wrapper.append(entry);
    }

    container.append(wrapper);
  }

  function renderSessionHistory() {
    sessionList.replaceChildren();

    historyCount.textContent = String(sessionHistory.length);
    historyCount.setAttribute(
      'aria-label',
      `${sessionHistory.length} completed ${
        sessionHistory.length === 1 ? 'session' : 'sessions'
      }`
    );

    emptyHistory.hidden = sessionHistory.length > 0;

    for (const session of sessionHistory.slice(0, 20)) {
      const item = document.createElement('article');
      item.className = 'session-item';

      const heading = document.createElement('h3');
      heading.className = 'session-task';
      heading.textContent = session.task;

      const goal = document.createElement('p');
      goal.className = 'session-goal';
      goal.textContent = `Goal: ${session.goal || 'Not specified'}`;

      const details = document.createElement('p');
      details.className = 'session-meta';
      details.textContent = `${session.duration} minutes completed`;

      const date = document.createElement('time');
      date.className = 'session-date';
      date.textContent = formatDate(session.completedAt);

      item.append(heading, goal, details, date);

      if (session.connection) {
        const connection = document.createElement('p');
        connection.className = 'session-connection';
        connection.textContent = session.connection;
        item.append(connection);
      }

      renderReflectionDetails(item, session);

      const reflectButton = document.createElement('button');
      reflectButton.type = 'button';
      reflectButton.className = 'reflection-edit-button';
      reflectButton.dataset.reflectId = session.id;
      reflectButton.textContent = hasReflection(session)
        ? 'Edit reflection'
        : 'Add reflection';
      item.append(reflectButton);

      sessionList.append(item);
    }

       renderGoalJourney();
    renderWeeklyInsights();

  }

  function openReflection(session) {
    if (!session) return;

    activeReflectionSessionId = session.id;

    const reflection = session.reflection || {};
    reflectionAccomplishment.value = reflection.accomplishment || '';
    reflectionChallenge.value = reflection.challenge || '';
    reflectionNextStep.value = reflection.nextStep || '';
    reflectionFeedback.textContent = '';

    $('#reflection-title').textContent = hasReflection(session)
      ? 'Review your reflection.'
      : 'Take a moment to reflect.';

    saveReflectionButton.textContent = hasReflection(session)
      ? 'Update reflection'
      : 'Save reflection';

    reflectionPanel.hidden = false;
    reflectionPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    reflectionAccomplishment.focus({ preventScroll: true });
  }

  function closeReflection() {
    reflectionPanel.hidden = true;
    activeReflectionSessionId = null;
    reflectionFeedback.textContent = '';
  }

  function saveCompletedSession() {
    if (!activeSessionFocus) return null;

    const session = {
      id: `session-${Date.now()}`,
      task: activeSessionFocus.task || 'Focus session',
      goal: activeSessionFocus.goal || '',
      connection: activeSessionFocus.connection || '',
      duration: Number(activeSessionFocus.duration),
      completedAt: Date.now(),
      reflection: {
        accomplishment: '',
        challenge: '',
        nextStep: '',
      },
    };

    sessionHistory = [session, ...sessionHistory].slice(0, MAX_HISTORY_ITEMS);

    const saved = persistSessionHistory();
    renderSessionHistory();

    timerStatus.textContent = saved
      ? 'Session complete! Your focus time has been saved.'
      : 'Session complete, but browser storage could not save your session.';

    return session;
  }

  function startTimer() {
    if (timerInterval !== null || remainingSeconds <= 0) return;

    if (!activeSessionFocus) {
      activeSessionFocus = {
        task: taskInput.value.trim() || 'Focus session',
        goal: goalInput.value.trim(),
        connection: connectionInput.value.trim(),
        duration: Number(durationInput.value),
      };
    }

    timerStatus.textContent = 'Focus session in progress. Stay with it.';
    startTimerButton.disabled = true;
    pauseTimerButton.disabled = false;

    timerInterval = setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      renderTimerDisplay();

      if (remainingSeconds === 0) {
        stopTimer();

        startTimerButton.textContent = 'Session Complete';
        startTimerButton.disabled = true;
        pauseTimerButton.disabled = true;

        const completedSession = saveCompletedSession();
        activeSessionFocus = null;

        if (completedSession) {
          openReflection(completedSession);
        }
      }
    }, 1000);
  }

  startTimerButton.addEventListener('click', startTimer);

  pauseTimerButton.addEventListener('click', () => {
    if (timerInterval === null) return;

    stopTimer();
    timerStatus.textContent = 'Timer paused. Resume when ready.';
    startTimerButton.textContent = 'Resume Focus';
    startTimerButton.disabled = false;
    pauseTimerButton.disabled = true;
  });

  resetTimerButton.addEventListener('click', resetTimerState);
  durationInput.addEventListener('change', resetTimerState);

  function renderTodayCard(focus) {
    const task = (focus.task || '').trim();
    todayCard.hidden = !task;

    if (!task) return;

    savedTaskTitle.textContent = task;
    savedTaskGoal.textContent = focus.goal || '';
    savedTaskConnection.textContent = focus.connection || '';
    savedTaskDuration.textContent = `${focus.duration ?? 25} minutes planned`;
  }

  function setFieldError(field, message = '') {
    field.error.textContent = message;
    field.error.hidden = !message;
    field.input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  function refreshConnection() {
    const suggestion = createConnectionSentence(
      goalInput.value,
      taskInput.value
    );

    const connectionIsUntouched =
      !connectionInput.value.trim() ||
      connectionInput.value === lastSuggestion;

    if (connectionIsUntouched) {
      connectionInput.value = suggestion;
      lastSuggestion = suggestion;
    }
  }

  function handleInput(field, onInput) {
    field.input.addEventListener('input', () => {
      feedback.textContent = '';
      feedback.classList.remove('is-error');

      if (field.input.value.trim()) setFieldError(field);

      if (onInput) onInput();
    });
  }

  try {
    const saved = loadFocusDraft();

    goalInput.value = saved.goal || '';
    taskInput.value = saved.task || '';
    connectionInput.value = saved.connection || '';
    durationInput.value = String(saved.duration ?? 25);

    renderTimerPreview(saved.duration ?? 25);
    renderTodayCard(saved);
  } catch (error) {
    storageIsReadable = false;
    saveButton.disabled = true;
    feedback.textContent =
      'Saved focus details could not be read. Saving is paused to protect them.';
    feedback.classList.add('is-error');
    console.error('Could not load saved focus:', error);
  }

  sessionHistory = readSessionHistory();
  targetHours = readTargetHours();
  targetHoursInput.value = String(targetHours);
  renderSessionHistory();

  if (storageIsReadable) {
    lastSuggestion = createConnectionSentence(
      goalInput.value,
      taskInput.value
    );
    refreshConnection();
  }

  handleInput(fields[0], () => {
    refreshConnection();
    renderGoalJourney();
  });

  handleInput(fields[1], refreshConnection);
  handleInput(fields[2]);

  targetHoursInput.addEventListener('change', () => {
    targetHours = Number(targetHoursInput.value);

    try {
      localStorage.setItem(TARGET_KEY, String(targetHours));
    } catch (error) {
      console.error('Could not save focus target:', error);
    }

    renderGoalJourney();
  });

  saveButton.addEventListener('click', () => {
    if (!storageIsReadable) return;

    feedback.textContent = '';
    feedback.classList.remove('is-error');

    let firstInvalidField = null;

    for (const field of fields) {
      const message = field.input.value.trim() ? '' : field.message;
      setFieldError(field, message);

      if (message && !firstInvalidField) {
        firstInvalidField = field;
      }
    }

    if (firstInvalidField) {
      firstInvalidField.input.focus();
      return;
    }

    const focusDraft = {
      goal: goalInput.value.trim(),
      task: taskInput.value.trim(),
      connection: connectionInput.value.trim(),
      duration: Number(durationInput.value),
    };

    try {
      const saved = saveFocusDraft(focusDraft);

      goalInput.value = saved.goal;
      taskInput.value = saved.task;
      connectionInput.value = saved.connection;
      durationInput.value = String(saved.duration ?? focusDraft.duration);

      resetTimerState();
      renderTodayCard(saved);
      lastSuggestion = createConnectionSentence(saved.goal, saved.task);

      feedback.textContent = 'Today’s focus is saved in this browser.';
      renderGoalJourney();
    } catch (error) {
      feedback.textContent =
        'Focus could not be saved. Your entered details are still here.';
      feedback.classList.add('is-error');
      console.error('Could not save focus:', error);
    }
  });

  reflectionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const session = sessionHistory.find(
      (item) => item.id === activeReflectionSessionId
    );

    if (!session) {
      reflectionFeedback.textContent =
        'This session could not be found. Refresh the page and try again.';
      return;
    }

    session.reflection = {
      accomplishment: reflectionAccomplishment.value.trim(),
      challenge: reflectionChallenge.value.trim(),
      nextStep: reflectionNextStep.value.trim(),
    };

    if (!persistSessionHistory()) {
      reflectionFeedback.textContent =
        'Your reflection could not be saved to browser storage. Please try again.';
      return;
    }

    renderSessionHistory();
    reflectionFeedback.textContent = 'Reflection saved successfully.';
    saveReflectionButton.textContent = 'Update reflection';

    timerStatus.textContent = 'Your session reflection has been saved.';
  });

  closeReflectionButton.addEventListener('click', closeReflection);

  sessionList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-reflect-id]');
    if (!button) return;

    const session = sessionHistory.find(
      (item) => item.id === button.dataset.reflectId
    );

    openReflection(session);
  });

  renderTimerDisplay();
}
