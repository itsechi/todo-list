import { createTodo } from './createTodo';
import Todo from './todoConstructor'; // delete later

export default class UI {
  constructor() {
    UI.createTodoForm();
    UI.displayTodos();
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
    // delete later
    const task1 = new Todo('Learn JavaScript', 'Finish the course and start working on the project', '10/09/22', 'high');
    const task2 = new Todo('Learn JavaScript', 'Finish the course and start working on the project', '10/09/22', 'high');
    todos.push(task1, task2);
    console.log(todos);
    //
    todos.forEach(todo => {
      let html = `<div class="todo">
    <div class="todo__left">
      <input class="todo__check" type="checkbox" name="" id="">
      <div class="todo__text">
        <h3 class="todo__title">${todo.title}<span class="todo__priority"></span></h3>
        <p class="todo__date">${todo.dueDate}</p>
      </div>
    </div>
    <div class="todo__right">
    <span class="icon material-icons-outlined">
    edit
    </span>
<span class="icon material-icons-outlined">
delete
</span>
    </div>
  </div>`;
      container.insertAdjacentHTML('beforeend', html);
    });
  }
}
