import Todo from './Todo';

export const createTodo = (() => {
  const unfinishedTodos = [];

  function addTodo() {
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    const dueDate = document.getElementById('dueDateBtn').value;
    const project = document.getElementById('projectBtn').value;
    const priority = document.getElementById('priorityBtn').value;

    if (!title || title.trim().length === 0) return;
    const todo = new Todo(
      title,
      description,
      dueDate,
      project,
      priority,
      'unfinished'
    );
    unfinishedTodos.push(todo);
    console.log(todo);
  }
  return { addTodo, unfinishedTodos };
})();
