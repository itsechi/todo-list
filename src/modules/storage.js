import { createTodo } from './createTodo';
import UI from './UI';

const allTodos = createTodo.unfinishedTodos;

function setLocalStorage() {
  const data = JSON.stringify(allTodos);
  localStorage.setItem('todoArr', data);
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem('todoArr'));
  data.forEach(todo => allTodos.push(todo));
  UI.displayTodos();
}

export { setLocalStorage, getLocalStorage };
