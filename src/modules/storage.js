import { createTodo } from './createTodo';
import UI from './UI';

const allTodos = createTodo.unfinishedTodos;

function setLocalStorage() {
  const allTodosStorage = JSON.stringify(allTodos);
  const finishedTodosStorage = JSON.stringify(UI.finishedTodos);
  const projectsStorage = JSON.stringify(UI.projects);
  localStorage.setItem('todoArr', allTodosStorage);
  localStorage.setItem('finishedArr', finishedTodosStorage);
  localStorage.setItem('projectsArr', projectsStorage);
}

function getLocalStorage() {
  const allTodosStorage = JSON.parse(localStorage.getItem('todoArr'));
  const finishedTodosStorage = JSON.parse(localStorage.getItem('finishedArr'));
  const projectsStorage = JSON.parse(localStorage.getItem('projectsArr'));
  if (!finishedTodosStorage || !allTodosStorage || !projectsStorage) return;
  allTodosStorage.forEach(todo => allTodos.push(todo));
  finishedTodosStorage.forEach(todo => UI.finishedTodos.push(todo));
  projectsStorage.forEach(project => UI.projects.push(project));
  console.log(UI.projects);
  UI.displayTodos();
}

export { setLocalStorage, getLocalStorage };
