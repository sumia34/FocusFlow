const todayDate = document.querySelector('#today-date');
const sidebar = document.querySelector('#sidebar');
const mobileMenu = document.querySelector('#mobile-menu');
const sidebarBackdrop = document.querySelector('#sidebar-backdrop');
const taskForm = document.querySelector('#task-form');
const taskTitle = document.querySelector('#task-title');
const taskPriority = document.querySelector('#task-priority');
const taskTitleError = document.querySelector('#task-title-error');
const openTaskButtons = [
  document.querySelector('#open-task-form'),
  document.querySelector('#empty-add-task'),
];
const cancelTaskButton = document.querySelector('#cancel-task');
const emptyTasks = document.querySelector('#empty-tasks');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const taskFeedback = document.querySelector('#task-feedback');
const toastRegion = document.querySelector('#toast-region');
const tasks = [];
let toastTimeout;
let lastTaskOpener;

function formatToday(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

todayDate.textContent = formatToday(new Date());
todayDate.dateTime = new Date().toISOString().slice(0, 10);

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle('is-open', isOpen);
  sidebarBackdrop.classList.toggle('is-visible', isOpen);
  sidebarBackdrop.hidden = !isOpen;
  mobileMenu.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

mobileMenu.addEventListener('click', () => {
  setSidebarOpen(mobileMenu.getAttribute('aria-expanded') !== 'true');
});

sidebarBackdrop.addEventListener('click', () => setSidebarOpen(false));

sidebar.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => setSidebarOpen(false));
});

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toastRegion.textContent = message;
  toastRegion.classList.add('is-visible');
  toastTimeout = window.setTimeout(() => {
    toastRegion.classList.remove('is-visible');
  }, 3200);
}

document.querySelector('#edit-goal').addEventListener('click', () => {
  showToast('Goal editing will be available in a later feature. This is a sample goal.');
});

function clearTaskError() {
  taskTitleError.hidden = true;
  taskTitle.removeAttribute('aria-invalid');
}

function openTaskForm(button) {
  lastTaskOpener = button;
  taskForm.hidden = false;
  taskFeedback.textContent = '';
  clearTaskError();
  taskTitle.focus();
}

function closeTaskForm({ restoreFocus = true } = {}) {
  taskForm.hidden = true;
  taskForm.reset();
  taskPriority.value = 'medium';
  clearTaskError();
  taskFeedback.textContent = '';
  if (restoreFocus && lastTaskOpener) {
    lastTaskOpener.focus();
  }
}

openTaskButtons.forEach((button) => {
  button.addEventListener('click', () => openTaskForm(button));
});

cancelTaskButton.addEventListener('click', () => closeTaskForm());
taskTitle.addEventListener('input', () => {
  if (taskTitle.value.trim()) {
    clearTaskError();
  }
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  taskFeedback.textContent = '';

  const title = taskTitle.value.trim();
  if (!title) {
    taskTitleError.hidden = false;
    taskTitle.setAttribute('aria-invalid', 'true');
    taskTitle.focus();
    return;
  }

  clearTaskError();
  const task = {
    title,
    priority: taskPriority.value,
  };
  tasks.push(task);

  const listItem = document.createElement('li');
  listItem.className = 'task-row';

  const titleElement = document.createElement('span');
  titleElement.className = 'task-title';
  titleElement.textContent = task.title;

  const priorityElement = document.createElement('span');
  priorityElement.className = 'priority-label';
  priorityElement.dataset.priority = task.priority;
  priorityElement.textContent = `${task.priority[0].toUpperCase()}${task.priority.slice(1)} priority`;

  listItem.append(titleElement, priorityElement);
  taskList.append(listItem);
  taskList.hidden = false;
  emptyTasks.hidden = true;
  taskCount.textContent = String(tasks.length);
  taskFeedback.textContent = 'Added to today’s focus. This task will clear when you refresh.';
  closeTaskForm();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }
  if (!taskForm.hidden) {
    closeTaskForm();
  }
  if (sidebar.classList.contains('is-open')) {
    setSidebarOpen(false);
  }
});
