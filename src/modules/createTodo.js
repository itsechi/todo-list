import Todo from './todoConstructor';

export const createTodo = (() => {
  const unfinishedTodos = [];

  function addTodo() {
  let title = document.getElementById('todoTitle').value;
  let description = document.getElementById('todoDescription').value;
  let dueDate = document.getElementById('dueDateBtn').value;
  let project = document.getElementById('projectBtn').value;
  let priority = document.getElementById('priorityBtn').value;

  if (!title || title.trim().length === 0) return;
  // const todo = new Todo(title, description, dueDate, project, priority);
  const task1 = new Todo('Learn JavaScript', 'Finish the course and start working on the project', '10/09/22', 'high');
  unfinishedTodos.push(task1);
  console.log(unfinishedTodos);
  }
  return {addTodo, unfinishedTodos};
})();
