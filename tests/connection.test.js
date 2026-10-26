import test from 'node:test';
import assert from 'node:assert/strict';
import { createConnectionSentence } from '../src/connection.js';

test('suggests a personal connection using the supplied goal and task', () => {
  assert.equal(
    createConnectionSentence('Become a web developer', 'Practise JavaScript'),
    'I chose “Practise JavaScript” because it can help me make progress toward “Become a web developer.”',
  );
});

test('trims extra spaces from goal and task', () => {
  assert.equal(
    createConnectionSentence('  Learn English  ', '  Practise speaking  '),
    'I chose “Practise speaking” because it can help me make progress toward “Learn English.”',
  );
});

test('returns no suggestion when either value is blank', () => {
  assert.equal(createConnectionSentence('', 'Practise JavaScript'), '');
  assert.equal(createConnectionSentence('Become a web developer', '   '), '');
});
