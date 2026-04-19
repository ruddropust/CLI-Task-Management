const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

function loadTasks() {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      return [];
    }

    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    if (!data.trim()) {
      return [];
    }

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log('Warning: Could not load tasks file. Starting with an empty task list.');
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

module.exports = {
  loadTasks,
  saveTasks,
  TASKS_FILE,
};