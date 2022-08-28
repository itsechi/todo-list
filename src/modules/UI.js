import { createTodo } from './createTodo';

export default class UI {
  constructor() {
    this.createTodoForm();
  }

  createTodoForm() {
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
      document.getElementById('todoTitle').value = '';
      document.getElementById('todoDescription').value = '';
      document.getElementById('projectBtn').value = '';
      document.getElementById('priorityBtn').value = '';
      dueDateBtn.valueAsDate = new Date();
    }

    function addTodo(e) {
      e.preventDefault();
      createTodo.addTodo();
      closeTodoForm();
      displayTodos();
    }

    function displayTodos() {
      const container = document.getElementById('todoContainer');
      const todos = createTodo.unfinishedTodos;
      todos.forEach(todo => {
        let html = `<div class="todo">
      <div class="todo__left">
        <input type="radio" name="" id="">
        <div class="todo__text">
          <h3 class="todo__title">${todo.title}<span class="todo__priority"></span></h3>
          <p class="todo__date">${todo.dueDate}</p>
        </div>
      </div>
      <div class="todo__right"></div>
    </div>`;
        container.insertAdjacentHTML('afterend', html);
      });
    }
  }
}
