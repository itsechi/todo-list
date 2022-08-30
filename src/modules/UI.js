import { createTodo } from './createTodo';
import Todo from './todoConstructor'; // delete later
import { format } from 'date-fns';

export default class UI {
  constructor() {
    UI.createTodoForm();
    UI.displayTodos();
    UI.displayDetails();
    UI.container = document.getElementById('todoContainer');
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
    container.innerHTML = '';
    const todos = createTodo.unfinishedTodos;
    // delete later
    const task1 = new Todo(
      'Learn JavaScript',
      'Finish the course and start working on the project',
      '2022-08-29',
      '',
      'high'
    );
    const task2 = new Todo(
      'Learn JavaScript',
      'Finish the course and start working on the project',
      '2022-08-28',
      '',
      'medium'
    );
    const task3 = new Todo(
      'Learn JavaScript',
      'Finish the course and start working on the project',
      '2022-11-05',
      '',
      'low'
    );
    todos.push(task1, task2, task3);
    console.log(todos);
    //
    todos.forEach((todo, index) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const date = format(new Date(todo.dueDate), 'dd MMM yyyy');
      let html = `<div class="todo" data-index=${index}>
    <div class="todo__left">
      <input class="todo__check" type="checkbox" name="" id="">
      <div class="todo__text">
        <h3 class="todo__title">${
          todo.title
        }<span class="todo__priority todo__priority--${
        todo.priority
      }"></span></h3>
        <p class="todo__date">${today === todo.dueDate ? 'Today' : date}</p>
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

  static displayDetails() {
    const container = document.getElementById('todoContainer');
    container.addEventListener('click', e => {
      const todo = e.target.closest('.todo');
      const todos = createTodo.unfinishedTodos;
      if (!todo) return;
      const todoIndex = todo.dataset.index;
      const currentTodo = todos[todoIndex];
      const todoText = todo.querySelector('.todo__title');
      let html = `
        <p class="todo__description">${currentTodo.description}</p>
      `;
      todoText.insertAdjacentHTML('afterend', html);
    });
  }
}
