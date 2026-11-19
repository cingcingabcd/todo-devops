const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

// Pool palsu agar test tidak butuh database sungguhan (meniru bentuk hasil mysql2)
const fakePool = {
  query: async (sql) => {
    if (sql.startsWith('SELECT')) return [[{ id: 1, title: 'Contoh', done: 0 }]];
    if (sql.startsWith('INSERT')) return [{ insertId: 2 }];
    return [{ affectedRows: 1 }];
  },
};

test('API todos', async () => {
  const server = createApp(fakePool).listen(0);
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const health = await (await fetch(base + '/health')).json();
    assert.strictEqual(health.status, 'ok');

    const list = await (await fetch(base + '/api/todos')).json();
    assert.strictEqual(list.length, 1);

    const bad = await fetch(base + '/api/todos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    assert.strictEqual(bad.status, 400);

    const ok = await fetch(base + '/api/todos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tugas baru' }),
    });
    assert.strictEqual(ok.status, 201);
  } finally {
    server.close();
  }
});
