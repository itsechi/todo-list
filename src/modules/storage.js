import { createTodo } from './createTodo';
import UI from './UI';

const allTodos = createTodo.unfinishedTodos;

function setLocalStorage() {
  const allTodosStorage = JSON.stringify(allTodos);
  const finishedTodosStorage = JSON.stringify(UI.finishedTodos);
  localStorage.setItem('todoArr', allTodosStorage);
  localStorage.setItem('finishedArr', finishedTodosStorage);
}

function getLocalStorage() {
  const allTodosStorage = JSON.parse(localStorage.getItem('todoArr'));
  const finishedTodosStorage = JSON.parse(localStorage.getItem('finishedArr'));
  if (!finishedTodosStorage || !allTodosStorage) return;
  allTodosStorage.forEach(todo => allTodos.push(todo));
  finishedTodosStorage.forEach(todo => UI.finishedTodos.push(todo));
  UI.displayTodos();
}

export { setLocalStorage, getLocalStorage };
