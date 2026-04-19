const { saveTasks } = require('./fileHandler');
const {
  normalizeText,
  validateTitle,
  validatePriority,
  validateStatus,
  validateDueDate,
  validateId,
  toTitleCase,
} = require('./utils');

function getNextTaskId(tasks) {
  if (!tasks.length) {
    return 101;
  }

  const maxId = tasks.reduce((max, task) => {
    const currentId = Number(task.id) || 0;
    return currentId > max ? currentId : max;
  }, 100);

  return maxId + 1;
}

function isDuplicateTask(tasks, title, dueDate) {
  return tasks.some(
    (task) =>
      normalizeText(task.title) === normalizeText(title) &&
      task.dueDate === String(dueDate).trim()
  );
}

function addTask(tasks, taskData) {
  const titleError = validateTitle(taskData.title);
  if (titleError) {
    return { success: false, message: titleError };
  }

  const priorityError = validatePriority(taskData.priority);
  if (priorityError) {
    return { success: false, message: priorityError };
  }

  const dueDateError = validateDueDate(taskData.dueDate);
  if (dueDateError) {
    return { success: false, message: dueDateError };
  }

  if (isDuplicateTask(tasks, taskData.title, taskData.dueDate)) {
    return {
      success: false,
      message: 'Error: Task with same title and due date already exists.',
    };
  }

  const task = {
    id: getNextTaskId(tasks),
    title: String(taskData.title).trim(),
    description: String(taskData.description || '').trim(),
    priority: toTitleCase(taskData.priority),
    dueDate: String(taskData.dueDate).trim(),
    status: 'Pending',
  };

  tasks.push(task);
  saveTasks(tasks);

  return { success: true, message: 'Task added successfully!', task };
}

function getTasksGroupedByPriority(tasks) {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  return [...tasks].sort((a, b) => {
    const priorityCompare = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityCompare !== 0) {
      return priorityCompare;
    }

    const dueCompare = a.dueDate.localeCompare(b.dueDate);
    if (dueCompare !== 0) {
      return dueCompare;
    }

    return Number(a.id) - Number(b.id);
  });
}

function findTaskById(tasks, id) {
  const idError = validateId(id);
  if (idError) {
    return { success: false, message: idError };
  }

  const task = tasks.find((item) => Number(item.id) === Number(id));
  if (!task) {
    return { success: false, message: 'Task not found.' };
  }

  return { success: true, task };
}

function updateTaskStatus(tasks, id, newStatus) {
  const taskResult = findTaskById(tasks, id);
  if (!taskResult.success) {
    return taskResult;
  }

  const statusError = validateStatus(newStatus);
  if (statusError) {
    return { success: false, message: statusError };
  }

  taskResult.task.status = toTitleCase(newStatus);
  saveTasks(tasks);

  return {
    success: true,
    message: `Task status updated to ${taskResult.task.status}.`,
    task: taskResult.task,
  };
}

function deleteTask(tasks, id) {
  const taskResult = findTaskById(tasks, id);
  if (!taskResult.success) {
    return taskResult;
  }

  const index = tasks.findIndex((item) => Number(item.id) === Number(id));
  const deletedTask = tasks.splice(index, 1)[0];
  saveTasks(tasks);

  return { success: true, message: 'Task deleted successfully.', task: deletedTask };
}

function searchTasks(tasks, filters) {
  const title = normalizeText(filters.title || '');
  const status = normalizeText(filters.status || '');
  const priority = normalizeText(filters.priority || '');

  if (status) {
    const statusError = validateStatus(status);
    if (statusError) {
      return { success: false, message: statusError };
    }
  }

  if (priority) {
    const priorityError = validatePriority(priority);
    if (priorityError) {
      return { success: false, message: priorityError };
    }
  }

  const results = tasks.filter((task) => {
    const matchesTitle = !title || normalizeText(task.title).includes(title);
    const matchesStatus = !status || normalizeText(task.status) === status;
    const matchesPriority = !priority || normalizeText(task.priority) === priority;
    return matchesTitle && matchesStatus && matchesPriority;
  });

  return { success: true, results: getTasksGroupedByPriority(results) };
}

module.exports = {
  addTask,
  getTasksGroupedByPriority,
  findTaskById,
  updateTaskStatus,
  deleteTask,
  searchTasks,
};