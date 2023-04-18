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

  getAdjacencyList(code){
    return this.#bl.getAdjacencyList(code);
  }

  getMinPath(origin, destination) {
    return this.#bl.getMinPath(origin, destination);
  }

  getMaxPath(origin, destination) {
    return this.#bl.getMaxPath(origin, destination);
  }

  getCountryByCode(code) {
    return this.#bl.getCountryByCode(code);
  }
}
