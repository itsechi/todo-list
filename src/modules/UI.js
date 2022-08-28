import { createTodo } from './createTodo';

export default class UI {
  constructor() {
    UI.createTodoForm();
  }

  static createTodoForm() {
    const openTodoFormBtn = document.getElementById('openTodoFormBtn');
    const closeTodoFormBtn = document.getElementById('closeTodoFormBtn');
    const overlay = document.getElementById('overlay');
    const todoForm = document.getElementById('todoForm');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const dueDateBtn = document.getElementById('dueDateBtn');

    // handlers
    openTodoFormBtn.addEventListener('click', displayTodoForm.bind(UI));
    overlay.addEventListener('click', closeTodoForm);
    closeTodoFormBtn.addEventListener('click', closeTodoForm);
    addTodoBtn.addEventListener('click', addTodo.bind(UI));

    dueDateBtn.valueAsDate = new Date();

    // functions
    function displayTodoForm() {
      overlay.classList.remove('hidden');
      todoForm.classList.remove('hidden');
      console.log(UI);
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
      UI.displayTodos();
    }
  }

  static displayTodos() {
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
