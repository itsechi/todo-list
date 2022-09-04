import { createTodo } from './createTodo';
import UI from './UI';

const todos = createTodo.unfinishedTodos;

function setLocalStorage() {
  const data = JSON.stringify(todos);
  localStorage.setItem('todoArr', data);
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem('todoArr'));
  data.forEach(todo => todos.push(todo));
  UI.displayTodos();
}

export { setLocalStorage, getLocalStorage };
