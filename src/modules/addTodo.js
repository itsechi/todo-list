import Todo from './createTodo';

export default function addTodoObject() {
  const title = document.getElementById('todoTitle').value;
  const description = document.getElementById('todoDescription').value;
  const dueDate = document.getElementById('dueDateBtn').value;
  const project = document.getElementById('projectBtn').value;
  const priority = document.getElementById('priorityBtn').value;
  const todo = new Todo(title, description, dueDate, project, priority);
  console.log(todo);
}
