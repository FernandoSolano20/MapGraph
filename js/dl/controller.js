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

  getAllNodes() {
    return this.#bl.getAllNodes();
  }

  getAllEdges() {
    return this.#bl.getAllEdges();
  }
}
