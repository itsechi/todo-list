import UI from './UI';

export default class Forms {
  displayForm(type) {
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('todoForm');
    overlay.classList.remove('hidden');
    form.classList.remove('hidden');

    const html = `
      <div class="form__header">
        <h2 class="form__title">${
          type === 'add' ? 'NEW TASK' : 'EDIT TASK'
        }</h2>
        <span class="icon icon--bold material-icons-outlined" id=${
          type === 'add' ? 'closeTodoFormBtn' : 'closeEditFormBtn'
        }>close</span>
      </div>

      <form class="form__form">
        <div class="form__inputs">
          <input class="form__text form__text--bold" type="text" placeholder="Title of the task" id="todoTitle">
          <textarea class="form__text" rows="3" cols="0" placeholder="Description" id="todoDescription" ></textarea>
          <div class="form__buttons">
            <input class="btn btn--secondary" type="date" id="dueDateBtn"></button>
            <select class="btn btn--secondary" id="projectBtn">
              <option disabled selected value>PROJECT</option>
            </select>
            <select class="btn btn--secondary" id="priorityBtn">
              <option disabled selected value>PRIORITY</option>
              <option value="high">HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
            </select>
          </div>
        </div>
        <button class="btn btn--primary" id=${
          type === 'add' ? 'addTodoBtn' : 'editTodoBtn'
        }>${type === 'add' ? 'ADD TASK' : 'EDIT TASK'}</button>
      </form>`;

    form.innerHTML = html;

    UI.projects.forEach(project => {
      const projectSelect = document.getElementById('projectBtn');
      const html = `<option value="${project.name}">${project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name}</option>`;
      projectSelect.insertAdjacentHTML('beforeend', html);
    });
  }

  closeForm() {
    const form = document.getElementById('todoForm');
    overlay.classList.add('hidden');
    form.classList.add('hidden');
    form.innerHTML = '';
  }
}
