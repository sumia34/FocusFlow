
const STORAGE_KEY = 'focusflow.current-focus.v1';
const ALLOWED_DURATIONS = [15, 25, 30, 45];

const emptyFocusDraft = () => ({
  goal: '',
  task: '',
  connection: '',
  duration: 25,
});

function isFocusDraft(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value.version === 1 &&
    typeof value.goal === 'string' &&
    typeof value.task === 'string' &&
    typeof value.connection === 'string' &&
    (
      value.duration === undefined ||
      ALLOWED_DURATIONS.includes(value.duration)
    )
  );
}

export function loadFocusDraft(storage = globalThis.localStorage) {
  const storedValue = storage.getItem(STORAGE_KEY);

  if (storedValue === null) {
    return emptyFocusDraft();
  }

  let parsedValue;

  try {
    parsedValue = JSON.parse(storedValue);
  } catch {
    throw new Error('Saved focus data is not valid JSON.');
  }

  if (!isFocusDraft(parsedValue)) {
    throw new Error('Saved focus data has an unsupported format.');
  }

  return {
    goal: parsedValue.goal,
    task: parsedValue.task,
    connection: parsedValue.connection,
    duration: parsedValue.duration ?? 25,
  };
}

export function saveFocusDraft(focusDraft, storage = globalThis.localStorage) {
  loadFocusDraft(storage);

  const nextDraft = {
    version: 1,
    goal: focusDraft.goal,
    task: focusDraft.task,
    connection: focusDraft.connection,
    duration: focusDraft.duration ?? 25,
  };

  if (
    typeof nextDraft.goal !== 'string' ||
    typeof nextDraft.task !== 'string' ||
    typeof nextDraft.connection !== 'string'
  ) {
    throw new TypeError('Focus details must be text.');
  }

  if (!ALLOWED_DURATIONS.includes(nextDraft.duration)) {
    throw new TypeError('Choose a supported focus duration.');
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(nextDraft));

  return {
    goal: nextDraft.goal,
    task: nextDraft.task,
    connection: nextDraft.connection,
    duration: nextDraft.duration,
  };
}

export { STORAGE_KEY };
