
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderApp } from '../src/app.js';

class FakeElement {
  constructor() {
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.hidden = false;
    this.disabled = false;
    this.focused = false;
    this.attributes = {};
    this.listeners = new Map();
    this.classes = new Set();
    this.children = [];
    this.style = {};
    this.dataset = {};

    this.classList = {
      add: (name) => this.classes.add(name),
      remove: (name) => this.classes.delete(name),
      contains: (name) => this.classes.has(name),
      toggle: (name) => {
        if (this.classes.has(name)) {
          this.classes.delete(name);
          return false;
        }

        this.classes.add(name);
        return true;
      },
    };
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  append(...children) {
    this.children.push(...children);
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = children;
    this.innerHTML = '';
    this.textContent = '';
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  remove() {}

  focus() {
    this.focused = true;
  }

  scrollIntoView() {}

  closest() {
    return null;
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }

  emit(type) {
    this.listeners.get(type)?.({
      target: this,
      currentTarget: this,
      preventDefault() {},
    });
  }
}

function createAppEnvironment() {
  const ids = [
    '#goal-input',
    '#task-input',
    '#duration-input',
    '#connection-input',
    '#save-focus',
    '#save-feedback',
    '#goal-error',
    '#task-error',
    '#connection-error',
  ];

  const elements = new Map(
    ids.map((id) => [id, new FakeElement()]),
  );

  elements.get('#duration-input').value = '25';

  const app = {
    innerHTML: '',
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, new FakeElement());
      }

      return elements.get(selector);
    },
    querySelectorAll() {
      return [];
    },
    append(...children) {
      this.children ??= [];
      this.children.push(...children);
    },
    replaceChildren(...children) {
      this.children = children;
      this.innerHTML = '';
    },
  };

  return {
    app,
    elements,
    document: {
      querySelector: () => app,
      createElement: () => new FakeElement(),
    },
  };
}

function withBrowserGlobals(environment, storage, callback) {
  const previousDocument = globalThis.document;
  const previousStorage = globalThis.localStorage;

  globalThis.document = environment.document;
  globalThis.localStorage = storage;

  try {
    callback();
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }

    if (previousStorage === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = previousStorage;
    }
  }
}

function createMemoryStorage(initialValue = null) {
  return {
    value: initialValue,

    getItem() {
      return this.value;
    },

    setItem(_key, value) {
      this.value = String(value);
    },
  };
}

test('restores fields, suggests a connection, and saves an edited focus draft', () => {
  const environment = createAppEnvironment();
  const storage = createMemoryStorage();

  withBrowserGlobals(environment, storage, () => {
    renderApp();

    const goal = environment.elements.get('#goal-input');
    const task = environment.elements.get('#task-input');
    const connection = environment.elements.get('#connection-input');
    const saveButton = environment.elements.get('#save-focus');
    const feedback = environment.elements.get('#save-feedback');

    assert.equal(saveButton.disabled, false);

    goal.value = 'Become a web developer';
    goal.emit('input');

    task.value = 'Practise JavaScript functions';
    task.emit('input');

    assert.equal(
      connection.value,
      'I chose “Practise JavaScript functions” because it can help me make progress toward “Become a web developer.”',
    );

    connection.value = 'This helps me build the skills I need.';
    connection.emit('input');
    saveButton.emit('click');

    assert.deepEqual(JSON.parse(storage.value), {
      version: 1,
      goal: 'Become a web developer',
      task: 'Practise JavaScript functions',
      connection: 'This helps me build the skills I need.',
      duration: 25,
    });

    assert.match(feedback.textContent, /saved in this browser/i);
  });
});

test('shows validation and focuses the first missing required field', () => {
  const environment = createAppEnvironment();
  const storage = createMemoryStorage();

  withBrowserGlobals(environment, storage, () => {
    renderApp();
    environment.elements.get('#save-focus').emit('click');

    assert.equal(
  environment.elements.get('#goal-error').textContent,
  'Enter a goal you would like to work toward.',
);
    assert.equal(environment.elements.get('#goal-input').focused, true);
    assert.equal(storage.value, null);
  });
});
