import getCountries from './api/getCountries';
import Graph from './structures/graph';

export default class Business {
  #graph;

  async createGraph() {
    const countries = await getCountries();
    this.#graph = new Graph(countries);
    return true;
  }

  getAllCountries() {
    return this.#graph.getAllNodes();
  }

  getAllEdges() {
    return this.#graph.getAllEdges();
  }

  getAdjacencyList(code) {
    return this.#graph.getAdjacencyList(code);
  }

  getMinPath(origin, destination) {
    return this.#graph.getMinPath(origin, destination);
  }

  getMaxPath(origin, destination) {
    return this.#graph.getMaxPath(origin, destination);
  }

  getCountryByCode(code) {
    return this.#graph.getItem(code);
  }
}
