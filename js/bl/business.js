import getCountries from './api/getCountries';
import Graph from './structures/graph';

export default class Business {
  #graph;

  async createGraph() {
    const countries = await getCountries();
    this.#graph = new Graph(countries);
    return true;
  }

  getAllNodes() {
    return this.#graph.getAllNodes();
  }

  getAllEdges() {
    return this.#graph.getAllEdges();
  }
}
