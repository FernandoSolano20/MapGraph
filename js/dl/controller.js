import Business from '../bl/business';

export default class Controller {
  #bl;

  constructor() {
    this.#bl = new Business();
  }

  async createGraph() {
    const result = await this.#bl.createGraph();
    return result;
  }

  getAllCountries() {
    return this.#bl.getAllCountries();
  }

  getAllEdges() {
    return this.#bl.getAllEdges();
  }

  getMinPath(origin, destination) {
    return this.#bl.getMinPath(origin, destination);
  }

  getCountryByCode(code) {
    return this.#bl.getCountryByCode(code);
  }
}
