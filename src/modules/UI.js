import { createTodo } from './createTodo';
import { format } from 'date-fns';
import { getLocalStorage } from './createStorage';
import { setLocalStorage } from './createStorage';
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
        displayTodos(currentDisplay);
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
          progressBar(currentDisplay);
        }

        if (!todoTitle.classList.contains('todo__title--complete')) {
          todo.status = 'unfinished';
          if (finishedTodos.length > 0) {
            const findIndex = finishedTodos.findIndex(
              finishedTodo => finishedTodo === todo
            );
            finishedTodos.splice(findIndex, 1);
          }

          setLocalStorage();
          progressBar(currentDisplay);
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
        displayTodos(currentDisplay);
        setLocalStorage();
      }
    });
  }

  function removeCompleted() {
    const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
    deleteCompletedBtn.addEventListener('click', deleteCompleted);

    function deleteCompleted() {
      const findCompletedInAll = allTodos.filter(
        todo => todo.status === 'finished'
      );
      findCompletedInAll.map(todo => {
        const index = allTodos.indexOf(todo);
        allTodos.splice(index, 1);
        finishedTodos.splice(0, finishedTodos.length);
      });
      displayTodos(currentDisplay);
      setLocalStorage();
    }
  }

  // SORT TODOS
  function sortTodos() {
    const sortByBtn = document.getElementById('sortByBtn');
    sortByBtn.addEventListener('change', () => {
      if (sortByBtn.value === 'new') {
        allTodos.sort((a, b) => {
          return sortBy(a.creationDate, b.creationDate);
        });
      }
      if (sortByBtn.value === 'status') {
        allTodos.sort((a, b) => {
          return sortBy(a.status, b.status);
        });
      }

      if (sortByBtn.value === 'dueDate') {
        allTodos.sort((a, b) => {
          return sortBy(a.dueDate, b.dueDate);
        });
      }
      displayTodos(currentDisplay);
    });

    function sortBy(first, second) {
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
    }
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
          displayTodos(currentDisplay);
          setLocalStorage();
        }
      }
    });
  }

  // PROJECTS
  function createProjects() {
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
      const closeProjectFormBtn = document.querySelector(
        '#closeProjectFormBtn'
      );

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
        if (!projectTitle || projectTitle.trim().length === 0) return;
        const project = new Project(projectTitle);
        projects.push(project);
        addProjectsToSelect();
        setLocalStorage();
        closeProjectForm();
      }
    }
  }

  function removeProject() {
    const deleteProjectBtn = document.getElementById('deleteProjectBtn');
    deleteProjectBtn.addEventListener('click', deleteProject);

    function deleteProject() {
      const currentProject = projects.findIndex(
        project => project.name === currentDisplay
      );
      const projectTodos = allTodos.filter(
        todo => todo.project === currentDisplay
      );
      const projectFinishedTodos = finishedTodos.filter(
        todo => todo.project === currentDisplay
      );

      // remove todos from allTodos
      projectTodos.map(todo => {
        const index = allTodos.indexOf(todo);
        allTodos.splice(index, 1);
      });
      // remove todos from finishedTodos
      projectFinishedTodos.map(todo => {
        const index = finishedTodos.indexOf(todo);
        finishedTodos.splice(index, 1);
      });

      // remove the project and update UI
      projects.splice(currentProject, 1);
      const todoSelect = document.querySelector(
        `option[value="${currentDisplay}"]`
      );
      todoSelect.remove();
      currentDisplay = 'home';
      displayTodos(currentDisplay);
      showTab('home');
      setLocalStorage();
    }
  }

  // DISPLAY TABS
  function tabHandlers() {
    const showTodayBtn = document.getElementById('showTodayBtn');
    showTodayBtn.addEventListener('click', () => {
      showTab('today');
    });

    const showHomeBtn = document.getElementById('showHomeBtn');
    showHomeBtn.addEventListener('click', () => {
      showTab('home');
    });

    const projectSelect = document.getElementById('projectSelect');
    projectSelect.addEventListener('change', () => {
      showTab(projectSelect.value);
      currentDisplay = projectSelect.value;
      projectSelect.value = '';
    });
  }

  function showTab(projectName) {
    currentDisplay = projectName;
    currentTab.textContent =
      projectName.length > 15
        ? projectName.toUpperCase().substring(0, 15) + '...'
        : projectName.toUpperCase();
    displayTodos(projectName);

    const deleteProjectBtn = document.getElementById('deleteProjectBtn');
    console.log(currentDisplay);
    deleteProjectBtn.classList.add('hidden');
    if (currentDisplay !== 'today' && currentDisplay !== 'home')
      deleteProjectBtn.classList.remove('hidden');
  }

  // PROGRESS BAR
  function progressBar(projectName) {
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
        : currentDisplay === 'home'
        ? (finishedTodos.length / allTodos.length) * 100
        : (finishedProjectTodos.length / projectTodos.length) * 100;

    if (isNaN(width)) width = 0;
    const bar = document.getElementById('progress');
    bar.style.width = width + '%';
  }

  function addProjectsToSelect() {
    const projectSelect = document.getElementById('projectSelect');
    projectSelect.innerHTML =
      '<option disabled selected value>PROJECTS</option>';
    projects.forEach(project => {
      const html = `<option value="${project.name}">${
        project.name.length > 20
          ? project.name.substring(0, 20) + '...'
          : project.name
      }</option>`;
      projectSelect.insertAdjacentHTML('beforeend', html);
    });
  }

  function initialize() {
    createTodoForm();
    displayDetails();
    markComplete();
    removeTodo();
    createEditForm();
    getLocalStorage();
    addProjectsToSelect();
    sortTodos();
    createProjects();
    removeCompleted();
    removeProject();
    tabHandlers();
  }

  return { initialize, displayTodos, finishedTodos, projects };
})();

export default UI;
