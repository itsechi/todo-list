import { createTodo } from './createTodo';
import Todo from './todoConstructor'; // delete later
import { format } from 'date-fns';

const UI = (() => {
  const container = document.getElementById('todoContainer');
  const todos = createTodo.unfinishedTodos;
  const overlay = document.getElementById('overlay');
  const todoForm = document.getElementById('todoForm');

  function createTodoForm() {
    const openTodoFormBtn = document.getElementById('openTodoFormBtn');
    openTodoFormBtn.addEventListener('click', displayTodoForm);

    // functions
    function displayTodoForm() {
      overlay.classList.remove('hidden');
      todoForm.classList.remove('hidden');

      const html = `
      <div class="form__header">
        <h2 class="form__title">NEW TASK</h2>
        <span class="icon icon--bold material-icons-outlined" id="closeTodoFormBtn">close</span>
      </div>

      <form class="form__form">
        <div class="form__inputs">
          <input class="form__text form__text--bold" type="text" placeholder="Title of the task" id="todoTitle">
          <textarea class="form__text" rows="3" cols="0" placeholder="Description" id="todoDescription"></textarea>
          <div class="form__buttons">
            <input class="btn btn--secondary" type="date" id="dueDateBtn"></button>
            <select class="btn btn--secondary" id="projectBtn">
              <option disabled selected value>PROJECT</option>
            </select>
            <select class="btn btn--secondary" id="priorityBtn">
              <option disabled selected value>PRIORITY</option>
              <option value="high">HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
            </select>
          </div>
        </div>
        <button class="btn btn--primary" id="addTodoBtn">ADD TASK</button>
      </form>`;
      todoForm.innerHTML = html;

      const addTodoBtn = document.getElementById('addTodoBtn');
      const closeTodoFormBtn = document.getElementById('closeTodoFormBtn');
      const dueDateBtn = document.getElementById('dueDateBtn');
      dueDateBtn.valueAsDate = new Date();

      // handlers
      overlay.addEventListener('click', closeTodoForm);
      closeTodoFormBtn.addEventListener('click', closeTodoForm);
      addTodoBtn.addEventListener('click', addTodo);
    }

    function closeTodoForm() {
      overlay.classList.add('hidden');
      todoForm.classList.add('hidden');
      document.getElementById('todoTitle').value = '';
      document.getElementById('todoDescription').value = '';
      document.getElementById('projectBtn').value = '';
      document.getElementById('priorityBtn').value = '';
      dueDateBtn.valueAsDate = new Date();
      todoForm.innerHTML = '';
    }

    function addTodo(e) {
      e.preventDefault();
      createTodo.addTodo();
      closeTodoForm();
      displayTodos();
    }
  }

  function displayTodos() {
    container.innerHTML = '';
    todos.forEach((todo, index) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const date = format(new Date(todo.dueDate), 'dd MMM yyyy');
      // prettier-ignore
      const html = `
      <div class="todo" data-index=${index}>
        <div class="todo__left">
          <input class="todo__check" type="checkbox" name="" id="">
          <div class="todo__text">
            <h3 class="todo__title">${todo.title}<span class="todo__priority todo__priority--${todo.priority}"></span></h3>
            <p class="todo__description hidden">${todo.description}</p>
            <p class="todo__date">${today === todo.dueDate ? 'Today' : date}</p>
          </div>
        </div>
        <div class="todo__right">
          <span class="edit icon material-icons-outlined">edit</span>
          <span class="delete icon material-icons-outlined">delete</span>
        </div>
      </div>`;
      container.insertAdjacentHTML('beforeend', html);
    });
  }

  function displayDetails() {
    container.addEventListener('click', e => {
      if (
        e.target.classList.contains('todo__check') ||
        e.target.classList.contains('icon')
      )
        return;
      const todo = e.target.closest('.todo');
      if (!todo) return;
      const todoText = todo.querySelector('.todo__description');
      todoText.classList.toggle('hidden');
    });
  }

  function markComplete() {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('todo__check')) {
        const todo = e.target.parentElement.querySelector('.todo__title');
        todo.classList.toggle('todo__title--complete');
      }
    });
  }

  function removeTodo() {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('delete')) {
        const todoIndex = e.target.closest('.todo').dataset.index;
        todos.splice(todoIndex, 1);
        displayTodos();
      }
    });
  }

  function createEditForm() {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('edit')) {
        const todoIndex = e.target.closest('.todo').dataset.index;
        const currTodo = todos[todoIndex];
        displayEditForm();

        const title = document.getElementById('todoTitle');
        const description = document.getElementById('todoDescription');
        const dueDate = document.getElementById('dueDateBtn');
        const project = document.getElementById('projectBtn');
        const priority = document.getElementById('priorityBtn');
        title.value = currTodo.title;
        description.value = currTodo.description;
        dueDate.value = currTodo.dueDate;
        project.value = currTodo.project;
        priority.value = currTodo.priority;

        function displayEditForm() {
          overlay.classList.remove('hidden');
          todoForm.classList.remove('hidden');

          const html = `
          <div class="form__header">
            <h2 class="form__title">EDIT TASK</h2>
            <span class="icon icon--bold material-icons-outlined" id="closeEditFormBtn">close</span>
          </div>

          <form class="form__form">
            <div class="form__inputs">
              <input class="form__text form__text--bold" type="text" placeholder="Title of the task" id="todoTitle">
              <textarea class="form__text" rows="3" cols="0" placeholder="Description" id="todoDescription" ></textarea>
              <div class="form__buttons">
                <input class="btn btn--secondary" type="date" id="dueDateBtn"></button>
                <select class="btn btn--secondary" id="projectBtn">
                  <option disabled selected value>PROJECT</option>
                </select>
                <select class="btn btn--secondary" id="priorityBtn">
                  <option disabled selected value>PRIORITY</option>
                  <option value="high">HIGH</option>
                  <option value="medium">MEDIUM</option>
                  <option value="low">LOW</option>
                </select>
              </div>
            </div>
            <button class="btn btn--primary" id="editTodoBtn">EDIT TASK</button>
          </form>`;

          todoForm.innerHTML = html;
          const editTodoBtn = document.querySelector('#editTodoBtn');
          const closeEditBtn = document.querySelector('#closeEditFormBtn');

          // handlers
          closeEditBtn.addEventListener('click', closeEditForm);
          editTodoBtn.addEventListener('click', pushEdit);
        }

        function closeEditForm() {
          overlay.classList.add('hidden');
          todoForm.classList.add('hidden');
          todoForm.innerHTML = '';
        }

        function pushEdit(e) {
          e.preventDefault();
          currTodo.title = title.value;
          currTodo.description = description.value;
          currTodo.dueDate = dueDate.value;
          currTodo.project = project.value;
          currTodo.priority = priority.value;
          closeEditForm();
          displayTodos();
        }
      }
    });
  }

  function initialize() {
    createTodoForm();
    displayTodos();
    displayDetails();
    markComplete();
    removeTodo();
    createEditForm();
  }

  return { initialize };
})();

export default UI;
