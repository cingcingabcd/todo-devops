const express = require('express');
const path = require('path');
const { validateTitle } = require('./validate');

function createApp(pool) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/api/todos', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, title, done FROM todos ORDER BY id DESC');
      res.json(rows);
    } catch (e) {
      console.error('GET /api/todos gagal:', e.message);
      res.status(500).json({ error: 'Kesalahan database' });
    }
  });

  app.post('/api/todos', async (req, res) => {
    const v = validateTitle(req.body && req.body.title);
    if (!v.ok) return res.status(400).json({ error: v.error });
    try {
      const [result] = await pool.query('INSERT INTO todos (title) VALUES (?)', [v.value]);
      const [rows] = await pool.query('SELECT id, title, done FROM todos WHERE id = ?', [result.insertId]);
      console.log('To-do dibuat id=' + rows[0].id);
      res.status(201).json(rows[0]);
    } catch (e) {
      console.error('POST /api/todos gagal:', e.message);
      res.status(500).json({ error: 'Kesalahan database' });
    }
  });

  app.patch('/api/todos/:id/toggle', async (req, res) => {
    try {
      const [result] = await pool.query('UPDATE todos SET done = NOT done WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Tidak ditemukan' });
      const [rows] = await pool.query('SELECT id, title, done FROM todos WHERE id = ?', [req.params.id]);
      res.json(rows[0]);
    } catch (e) {
      res.status(500).json({ error: 'Kesalahan database' });
    }
  });

  app.delete('/api/todos/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ error: 'Kesalahan database' });
    }
  });

  return app;
}
module.exports = { createApp };
