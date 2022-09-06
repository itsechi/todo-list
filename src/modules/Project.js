export default class Project {
  constructor(name) {
    this.name = name;
  }

  addProject() {
    const projectSelect = document.getElementById('projectSelect');
    const html = `<option value="${this.name}">${this.name}</option>`;
    projectSelect.insertAdjacentHTML('beforeend', html);
  }
}
