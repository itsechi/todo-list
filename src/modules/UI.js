import addTodoObject from './addTodo';

export default function UI() {
  const openTodoFormBtn = document.getElementById('openTodoFormBtn');
  const closeTodoFormBtn = document.getElementById('closeTodoFormBtn');
  const overlay = document.getElementById('overlay');
  const todoForm = document.getElementById('todoForm');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const dueDateBtn = document.getElementById('dueDateBtn');

  // handlers
  openTodoFormBtn.addEventListener('click', displayTodoForm);
  overlay.addEventListener('click', closeTodoForm);
  closeTodoFormBtn.addEventListener('click', closeTodoForm);
  addTodoBtn.addEventListener('click', addTodo);

  dueDateBtn.valueAsDate = new Date();

  // functions
  function displayTodoForm() {
    overlay.classList.remove('hidden');
    todoForm.classList.remove('hidden');
  }

  function closeTodoForm() {
    overlay.classList.add('hidden');
    todoForm.classList.add('hidden');
  }

  function addTodo(e) {
    e.preventDefault();
    closeTodoForm();
    addTodoObject();
  }
}
