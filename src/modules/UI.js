export default function UI() {
  const openTodoFormBtn = document.getElementById('openTodoFormBtn');
  const overlay = document.getElementById('overlay');
  const todoForm = document.getElementById('todoForm');
  openTodoFormBtn.addEventListener('click', displayTodoForm);

  function displayTodoForm() {
    overlay.classList.remove('hidden');
    todoForm.classList.remove('hidden');
  }
}