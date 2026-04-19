const readline = require('readline');
const { loadTasks } = require('./fileHandler');
const {
  addTask,
  getTasksGroupedByPriority,
  findTaskById,
  updateTaskStatus,
  deleteTask,
  searchTasks,
} = require('./taskService');
const {
  askQuestion,
  printMenu,
  printDivider,
  formatTaskLine,
} = require('./utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let tasks = loadTasks();

function displayTaskList(taskList, heading = 'TASK LIST') {
  console.log(`\n${heading}`);
  printDivider(50);

  if (!taskList.length) {
    console.log('No tasks found.');
    return;
  }

  const groups = {
    High: [],
    Medium: [],
    Low: [],
  };

  taskList.forEach((task) => {
    groups[task.priority].push(task);
  });

  let counter = 1;
  ['High', 'Medium', 'Low'].forEach((priority) => {
    if (!groups[priority].length) {
      return;
    }

    console.log(`\n${priority.toUpperCase()} PRIORITY`);
    printDivider(50);

    groups[priority].forEach((task) => {
      console.log(formatTaskLine(counter, task));
      if (task.description) {
        console.log(`   Description: ${task.description}`);
      }
      counter += 1;
    });
  });
}

async function handleAddTask() {
  console.log('\nAdd Task');
  printDivider(20);

  const title = await askQuestion(rl, 'Enter Title: ');
  const description = await askQuestion(rl, 'Enter Description: ');
  const priority = await askQuestion(rl, 'Enter Priority (Low/Medium/High): ');
  const dueDate = await askQuestion(rl, 'Enter Due Date (YYYY-MM-DD): ');

  const result = addTask(tasks, { title, description, priority, dueDate });
  console.log(result.message);
}

function handleViewTasks() {
  const sortedTasks = getTasksGroupedByPriority(tasks);
  displayTaskList(sortedTasks, 'ALL TASKS');
}

async function handleSearchTasks() {
  console.log('\nSearch Task');
  printDivider(20);
  console.log('Leave any field blank to skip that filter.');

  const title = await askQuestion(rl, 'Search by Title: ');
  const status = await askQuestion(rl, 'Search by Status (Pending/In Progress/Completed): ');
  const priority = await askQuestion(rl, 'Search by Priority (Low/Medium/High): ');

  const result = searchTasks(tasks, { title, status, priority });
  if (!result.success) {
    console.log(result.message);
    return;
  }

  displayTaskList(result.results, 'SEARCH RESULTS');
}

async function handleUpdateTaskStatus() {
  console.log('\nUpdate Task Status');
  printDivider(25);

  const id = await askQuestion(rl, 'Enter Task ID: ');
  const found = findTaskById(tasks, id);
  if (!found.success) {
    console.log(found.message);
    return;
  }

  console.log(`Current Task: [${found.task.id}] ${found.task.title} | ${found.task.status}`);
  const status = await askQuestion(rl, 'Enter New Status (Pending/In Progress/Completed): ');

  const result = updateTaskStatus(tasks, id, status);
  console.log(result.message);
}

async function handleDeleteTask() {
  console.log('\nDelete Task');
  printDivider(20);

  const id = await askQuestion(rl, 'Enter Task ID: ');
  const found = findTaskById(tasks, id);
  if (!found.success) {
    console.log(found.message);
    return;
  }

  console.log(`Task: [${found.task.id}] ${found.task.title} | ${found.task.status} | Due: ${found.task.dueDate}`);
  const confirm = await askQuestion(rl, 'Are you sure? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('Deletion cancelled.');
    return;
  }

  const result = deleteTask(tasks, id);
  console.log(result.message);
}

async function main() {
  console.log('Welcome to the CLI Task Manager!');

  while (true) {
    printMenu();
    const choice = await askQuestion(rl, 'Enter your choice: ');

    switch (choice) {
      case '1':
        await handleAddTask();
        break;
      case '2':
        handleViewTasks();
        break;
      case '3':
        await handleSearchTasks();
        break;
      case '4':
        await handleUpdateTaskStatus();
        break;
      case '5':
        await handleDeleteTask();
        break;
      case '6':
        console.log('Goodbye!');
        rl.close();
        return;
      default:
        console.log('Invalid choice. Please enter a number between 1 and 6.');
    }
  }
}

main();