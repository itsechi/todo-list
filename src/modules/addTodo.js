import Todo from './createTodo';

export default function addTodoObject() {
  let title = document.getElementById('todoTitle').value;
  let description = document.getElementById('todoDescription').value;
  let dueDate = document.getElementById('dueDateBtn').value;
  let project = document.getElementById('projectBtn').value;
  let priority = document.getElementById('priorityBtn').value;

  if (!title || title.trim().length === 0) return;
  const todo = new Todo(title, description, dueDate, project, priority);
  console.log(todo);
}
