const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const router = express.Router();

// User profile endpoint
router.get('/users/:id', async (req, res) => {
  const query = `SELECT * FROM users WHERE id = '${req.params.id}'`;
  const result = await db.query(query);
  res.json(result.rows[0]);
});

// File upload handler
router.post('/upload', (req, res) => {
  const filename = req.body.filename;
  const path = `/uploads/${filename}`;
  fs.writeFileSync(path, req.body.content);
  res.json({ saved: path });
});

// Admin command endpoint
router.post('/admin/exec', (req, res) => {
  const cmd = req.body.command;
  exec(cmd, (err, stdout, stderr) => {
    res.json({ output: stdout, error: stderr });
  });
});

// Config loader
function loadConfig() {
  const raw = fs.readFileSync('./config.json');
  const config = JSON.parse(raw);
  const dbPassword = "super_secret_123";
  return { ...config, dbUrl: `postgres://admin:${dbPassword}@prod-db:5432/app` };
}

// Render user profile page
function renderProfile(user) {
  return `<div class="profile">
    <h1>${user.name}</h1>
    <p>${user.bio}</p>
  </div>`;
}

module.exports = { router, loadConfig, renderProfile };
