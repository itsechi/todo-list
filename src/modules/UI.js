import { createTodo } from './createTodo';
import { format } from 'date-fns';
import { getLocalStorage } from './storage';
import { setLocalStorage } from './storage';
import Project from './Project';
import Forms from './Forms';

const UI = (() => {
  const container = document.getElementById('todoContainer');
  const overlay = document.getElementById('overlay');
  const form = document.getElementById('todoForm');
  const allTodos = createTodo.unfinishedTodos;
  const finishedTodos = [];
  const projects = [];
  let currentDisplay = 'home';

  function createTodoForm() {
    const openTodoFormBtn = document.getElementById('openTodoFormBtn');
    openTodoFormBtn.addEventListener('click', () => {
      const todoForm = new Forms();
      todoForm.displayForm('add');
      document.getElementById('dueDateBtn').valueAsDate = new Date();
      document.getElementById('todoTitle').focus();

      // handlers
      const addTodoBtn = document.getElementById('addTodoBtn');
      const closeTodoFormBtn = document.getElementById('closeTodoFormBtn');
      overlay.addEventListener('click', () => todoForm.closeForm());
      closeTodoFormBtn.addEventListener('click', () => todoForm.closeForm());
      addTodoBtn.addEventListener('click', addTodo);

      // functions
      function addTodo(e) {
        e.preventDefault();
        createTodo.addTodo();
        todoForm.closeForm();
        displayTodos();
        setLocalStorage();
      }
    });
  }

  // DISPLAY TODO
  function displayTodos(projectName) {
    container.innerHTML = '';
    allTodos.forEach((todo, index) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const date = format(new Date(todo.dueDate), 'dd MMM yyyy');
      if (
        (currentDisplay === 'today' && todo.dueDate === today) ||
        currentDisplay === 'home' ||
        (currentDisplay === projectName && todo.project === projectName)
      ) {
        // prettier-ignore
        const html = `
        <div class="todo" data-index=${index}>
          <div class="todo__left">
            <input class="todo__check" type="checkbox" ${
              todo.status === 'finished' ? 'checked' : ''
            }>
            <div class="todo__text">
              <h3 class="todo__title  ${
                todo.status === 'finished' ? 'todo__title--complete' : ''
              }">${todo.title}<span class="todo__priority todo__priority--${
          todo.priority
        }"></span></h3>
              <p class="todo__description hidden">${todo.description}</p>
              <p class="todo__date">${
                today === todo.dueDate ? 'Today' : date
              }</p>
            </div>
          </div>
          <div class="todo__right">
            <span class="edit icon material-icons-outlined">edit</span>
            <span class="delete icon material-icons-outlined">delete</span>
          </div>
        </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
      }
    });
    progressBar(projectName);
  }

  // INTERACTIONS
  function displayDetails() {
    container.addEventListener('click', e => {
      if (
        e.target.classList.contains('todo__check') ||
        e.target.classList.contains('icon')
      )
        return;
      const todo = e.target.closest('.todo');
      if (!todo) return;
      const todoDescription = todo.querySelector('.todo__description');
      todoDescription.classList.toggle('hidden');
    });
  }

  function markComplete() {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('todo__check')) {
        const todoTitle = e.target.parentElement.querySelector('.todo__title');
        todoTitle.classList.toggle('todo__title--complete');
        const todoIndex = e.target.closest('.todo').dataset.index;
        const todo = allTodos[todoIndex];

        if (todoTitle.classList.contains('todo__title--complete')) {
          todo.status = 'finished';
          finishedTodos.push(todo);
          setLocalStorage();
          progressBar();
        }
        if (!todoTitle.classList.contains('todo__title--complete')) {
          todo.status = 'unfinished';
          if (finishedTodos.length > 0) {
            const findObject = finishedTodos.find(
              finishedTodo => finishedTodo === todo
            );
            console.log(findObject);

            const findIndex = finishedTodos.indexOf(findObject);
            console.log(todo);
            finishedTodos.splice(findIndex, 1);
          }
          setLocalStorage();
          progressBar();
        }
      }
    });
  }

  function removeTodo() {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('delete')) {
        const todoIndex = e.target.closest('.todo').dataset.index;
        const todo = allTodos[todoIndex];

        if (todo.status === 'finished') {
          const findObject = finishedTodos.find(
            finishedTodo => finishedTodo === todo
          );
          const findIndex = finishedTodos.indexOf(findObject);
          finishedTodos.splice(findIndex, 1);
        }

        allTodos.splice(todoIndex, 1);
        displayTodos();
        setLocalStorage();
        progressBar();
      }
    });
  }

  // EDIT TODO
  function createEditForm() {
    container.addEventListener('click', e => {
      if (e.target.classList.contains('edit')) {
        const todoIndex = e.target.closest('.todo').dataset.index;
        const currTodo = allTodos[todoIndex];
        const editForm = new Forms();
        editForm.displayForm('edit');

        // set default form values
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
        title.focus();

        // handlers
        const editTodoBtn = document.querySelector('#editTodoBtn');
        const closeEditBtn = document.querySelector('#closeEditFormBtn');
        closeEditBtn.addEventListener('click', () => editForm.closeForm());
        overlay.addEventListener('click', () => editForm.closeForm());
        editTodoBtn.addEventListener('click', pushEdit);

        // functions
        function pushEdit(e) {
          e.preventDefault();
          currTodo.title = title.value;
          currTodo.description = description.value;
          currTodo.dueDate = dueDate.value;
          currTodo.project = project.value;
          currTodo.priority = priority.value;
          editForm.closeForm();
          displayTodos();
          setLocalStorage();
        }
      }
    });
  }

  // PROJECTS
  const openProjectFormBtn = document.getElementById('openProjectFormBtn');
  openProjectFormBtn.addEventListener('click', displayProjectForm);

  function displayProjectForm() {
    overlay.classList.remove('hidden');
    form.classList.remove('hidden');
    form.classList.add('form--small');

    const html = `
          <div class="form__header">
            <h2 class="form__title">ADD PROJECT</h2>
            <span class="icon icon--bold material-icons-outlined" id="closeProjectFormBtn">close</span>
          </div>

          <form class="form__form">
            <div class="form__inputs">
              <input class="form__text form__text--bold" type="text" placeholder="Title of the project" id="projectTitle">
            </div>
            <button class="btn btn--primary" id="addProjectBtn">ADD PROJECT</button>
          </form>`;
    form.innerHTML = html;

    const addProjectBtn = document.querySelector('#addProjectBtn');
    const closeProjectFormBtn = document.querySelector('#closeProjectFormBtn');

    // handlers
    closeProjectFormBtn.addEventListener('click', closeProjectForm);
    overlay.addEventListener('click', closeProjectForm);
    addProjectBtn.addEventListener('click', addProject);

    function closeProjectForm() {
      overlay.classList.add('hidden');
      form.classList.add('hidden');
      form.classList.remove('form--small');
      form.innerHTML = '';
    }

    function addProject(e) {
      e.preventDefault();
      const projectTitle = document.querySelector('#projectTitle').value;
      const project = new Project(projectTitle);
      projects.push(project);
      projects.forEach(project => {
        const projectSelect = document.getElementById('projectSelect');
        const html = `<option value="${project.name}">${project.name}</option>`;
        projectSelect.insertAdjacentHTML('beforeend', html);
      });
      setLocalStorage();
      closeProjectForm();
    }
  }

  // DISPLAY TABS
  const currentTab = document.getElementById('currentTab');

  const showTodayBtn = document.getElementById('showTodayBtn');
  showTodayBtn.addEventListener('click', showToday);

  const showHomeBtn = document.getElementById('showHomeBtn');
  showHomeBtn.addEventListener('click', showHome);

  const projectSelect = document.getElementById('projectSelect');
  projectSelect.addEventListener('change', () => {
    showProject(projectSelect.value);
    projectSelect.value = '';
  });

  function showToday() {
    currentDisplay = 'today';
    currentTab.textContent = 'TODAY';
    displayTodos();
  }

  function showHome() {
    currentDisplay = 'home';
    currentTab.textContent = 'HOME';
    displayTodos();
  }

  function showProject(projectName) {
    currentDisplay = projectName;
    currentTab.textContent = projectName;
    displayTodos(projectName);
  }

  function progressBar(projectName) {
    // let width = (finishedTodos.length / allTodos.length) * 100;
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTodos = allTodos.filter(todo => todo.dueDate === today);
    const finishedTodayTodos = finishedTodos.filter(
      todo => todo.dueDate === today
    );
    const projectTodos = allTodos.filter(todo => todo.project === projectName);
    const finishedProjectTodos = finishedTodos.filter(
      todo => todo.project === projectName
    );

    let width =
      currentDisplay === 'today'
        ? (finishedTodayTodos.length / todayTodos.length) * 100
        : currentDisplay === projectName
        ? (finishedProjectTodos.length / projectTodos.length) * 100
        : currentDisplay === 'home'
        ? (finishedTodos.length / allTodos.length) * 100
        : 0;
    if (isNaN(width)) width = 0;
    const bar = document.getElementById('progress');
    bar.style.width = width + '%';
  }

  function displayProjects() {
    projects.forEach(project => {
      const projectSelect = document.getElementById('projectSelect');
      const html = `<option value="${project.name}">${project.name}</option>`;
      projectSelect.insertAdjacentHTML('beforeend', html);
    });
  }

  function initialize() {
    createTodoForm();
    displayTodos();
    displayDetails();
    markComplete();
    removeTodo();
    createEditForm();
    getLocalStorage();
    displayProjects();
  }

  return { initialize, displayTodos, finishedTodos, projects };
})();

export default UI;
