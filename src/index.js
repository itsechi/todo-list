import './sass/main.scss';
import Todo from './modules/createTodo';
import UI from './modules/UI';
import addTodo from './modules/addTodo';

const task1 = new Todo('Learn JavaScript', 'Finish the course and start working on the project', '10/09/22', 'high');
console.log(task1);

UI();