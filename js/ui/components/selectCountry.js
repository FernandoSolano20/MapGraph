export default class SelectCountry {
  #countries;

  constructor(countries, id) {
    this.id = id || 'origin';
    this.#countries = countries;
    this.html = this.#createSelect();
  }

  #createSelect() {
    return `<select class="swal2-input" id="${this.id}">${this.#countries
      .map((country) => `<option value="${country.code}">${country.name}</option>`)
      .join('')}<select>`;
  }
}
