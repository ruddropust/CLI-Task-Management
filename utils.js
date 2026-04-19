function askQuestion(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer.trim()));
  });
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidDate(dateString) {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validateTitle(title) {
  if (!String(title || '').trim()) {
    return 'Title cannot be empty.';
  }
  return null;
}

function validatePriority(priority) {
  const allowed = ['low', 'medium', 'high'];
  if (!allowed.includes(normalizeText(priority))) {
    return 'Priority must be Low, Medium, or High.';
  }
  return null;
}

function validateStatus(status) {
  const allowed = ['pending', 'in progress', 'completed'];
  if (!allowed.includes(normalizeText(status))) {
    return 'Status must be Pending, In Progress, or Completed.';
  }
  return null;
}

function validateDueDate(dueDate) {
  if (!isValidDate(dueDate)) {
    return 'Due date must be in valid YYYY-MM-DD format.';
  }
  return null;
}

function validateId(id) {
  if (!/^\d+$/.test(String(id || '').trim())) {
    return 'ID must be numeric.';
  }
  return null;
}

function toTitleCase(value) {
  const text = normalizeText(value);
  if (text === 'in progress') {
    return 'In Progress';
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function printDivider(length) {
  console.log('-'.repeat(length));
}

function printMenu() {
  console.log('\n========= TASK MANAGER =========');
  console.log('1. Add Task');
  console.log('2. View Tasks');
  console.log('3. Search Task');
  console.log('4. Update Task Status');
  console.log('5. Delete Task');
  console.log('6. Exit');
  console.log('================================');
}

function formatTaskLine(index, task) {
  return `${index}. [${task.id}] ${task.title} | ${task.status} | ${task.priority} | Due: ${task.dueDate}`;
}

module.exports = {
  askQuestion,
  normalizeText,
  isValidDate,
  validateTitle,
  validatePriority,
  validateStatus,
  validateDueDate,
  validateId,
  toTitleCase,
  printDivider,
  printMenu,
  formatTaskLine,
};