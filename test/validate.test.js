const test = require('node:test');
const assert = require('node:assert');
const { validateTitle } = require('../src/validate');

test('judul valid diterima dan di-trim', () => {
  const r = validateTitle('  Belajar Docker  ');
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.value, 'Belajar Docker');
});
test('judul kosong ditolak', () => {
  assert.strictEqual(validateTitle('   ').ok, false);
});
test('judul non-string ditolak', () => {
  assert.strictEqual(validateTitle(123).ok, false);
});
test('judul lebih dari 100 karakter ditolak', () => {
  assert.strictEqual(validateTitle('a'.repeat(101)).ok, false);
});
