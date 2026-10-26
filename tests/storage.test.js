
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadFocusDraft,
  saveFocusDraft,
  STORAGE_KEY,
} from '../src/storage.js';

function createMemoryStorage(initialEntries = []) {
  const values = new Map(initialEntries);

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },

    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test('returns an empty focus draft when nothing has been saved', () => {
  assert.deepEqual(loadFocusDraft(createMemoryStorage()), {
    goal: '',
    task: '',
    connection: '',
    duration: 25,
  });
});

test('saves and restores the goal, task, connection, and duration', () => {
  const storage = createMemoryStorage();

  const focusDraft = {
    goal: 'Become a web developer',
    task: 'Practise JavaScript functions',
    connection: 'This helps me build the skills I need.',
    duration: 25,
  };

  saveFocusDraft(focusDraft, storage);

  assert.deepEqual(loadFocusDraft(storage), focusDraft);
});

test('does not overwrite malformed saved data', () => {
  const malformedValue = '{not valid json';
  const storage = createMemoryStorage([
    [STORAGE_KEY, malformedValue],
  ]);

  assert.throws(
    () =>
      saveFocusDraft(
        {
          goal: 'Goal',
          task: 'Task',
          connection: 'Reason',
          duration: 25,
        },
        storage,
      ),
    /not valid JSON/,
  );

  assert.equal(storage.getItem(STORAGE_KEY), malformedValue);
});
