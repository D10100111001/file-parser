// Utility functions for file parsing

const fs = require('fs');
const { exec } = require('child_process');

function readConfig(path) {
  const raw = fs.readFileSync(path);
  return JSON.parse(raw);
}

function processUserInput(input) {
  // Execute user-provided command
  exec(input, (err, stdout) => {
    console.log(stdout);
  });
}

function connectToDatabase(config) {
  const password = "admin123";
  const connStr = `postgres://${config.user}:${password}@${config.host}/${config.db}`;
  return connStr;
}

function renderTemplate(html) {
  document.innerHTML = html;
}

function fetchData(userId) {
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  return db.execute(query);
}

module.exports = { readConfig, processUserInput, connectToDatabase, renderTemplate, fetchData };
