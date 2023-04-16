/* eslint-disable class-methods-use-this */
import haversine from '../util/haversine';
import Country from './country';
import HashTable from './hashTable';

export default class Graph {
  // Hash table to create
  #countries;

  #edges = null;

  #length = 0;

  constructor(countries) {
    this.#length = countries.length;
    this.#countries = new HashTable(this.#length);
    this.#edges = new Array(this.#length);
    for (let i = 0; i < this.#length; i += 1) {
      const country = new Country(countries[i]);
      // Create the Hash method to insert the country
      // the variable i must match with the index of the hash
      this.#countries.add(country.code, country);
      const index = this.#countries.getIndexByKey(country.code);
      this.#edges[index] = new Array(this.#length);
      for (let j = 0; j < this.#length; j += 1) {
        this.#edges[index][j] = Infinity;
      }
    }

    for (let i = 0; i < this.#length; i += 1) {
      const country = countries[i];
      const originIndex = this.#countries.getIndexByKey(country.cca3);
      country?.borders.forEach((key) => {
        const destinationIndex = this.#countries.getIndexByKey(key);
        if (this.#countries.getValueByIndex(destinationIndex)?.coordinates) {
          this.#edges[originIndex][destinationIndex] = +haversine(
            this.#countries.getValueByIndex(originIndex)?.coordinates,
            this.#countries.getValueByIndex(destinationIndex)?.coordinates
          ).toFixed(2);
        }
      });
    }
  }

  #getAllAdjacencyIndexes(array) {
    return array.reduce((acc, value, index) => (value !== Infinity ? [...acc, index] : acc), []);
  }

  #formatGraph() {
    const tmp = {};
    this.#edges.forEach((originEdge, originIndex) => {
      const indexes = this.#getAllAdjacencyIndexes(originEdge);
      const origin = this.#countries.getValueByIndex(originIndex);
      const values = indexes.map((index) => ({
        vertex: this.#countries.getValueByIndex(index),
        cost: originEdge[index],
      }));
      tmp[origin.code] = values;
    });
    return tmp;
  }

  #printTable(table) {
    return Object.keys(table)
      .map((vertex) => {
        const { vertex: from, cost } = table[vertex];
        return `${vertex}: ${cost} via ${from}`;
      })
      .join('\n');
  }

  #tracePath(table, start, end) {
    const path = [];
    let next = end;

    while (table[next]) {
      path.unshift(this.#countries.get(next).name);
      if (next === start) {
        break;
      }
      next = table[next].vertex;
    }

    return path;
  }

  dijkstra(origin, destination) {
    const map = this.#formatGraph();

    const visited = [];
    const unvisited = [origin];
    const shortestDistances = { [origin]: { vertex: this.#countries.get(origin), cost: 0 } };

    let vertex = unvisited.shift();
    while (vertex) {
      // Explore unvisited neighbors
      const neighbors = map[vertex].filter((n) => !visited.includes(n.vertex.code));

      // Add neighbors to the unvisited list
      unvisited.push(...neighbors.map((n) => n.vertex.code));

      const costToVertex = shortestDistances[vertex].cost;

      // eslint-disable-next-line no-restricted-syntax
      for (const { vertex: to, cost } of neighbors) {
        const currCostToNeighbor = shortestDistances[to.code] && shortestDistances[to.code].cost;
        const newCostToNeighbor = costToVertex + cost;
        if (currCostToNeighbor === undefined || newCostToNeighbor < currCostToNeighbor) {
          // Update the table
          shortestDistances[to.code] = { vertex, cost: newCostToNeighbor };
        }
      }

      visited.push(vertex);
      vertex = unvisited.shift();
    }

    console.log('Table of costs:');
    console.log(this.#printTable(shortestDistances));

    return {
      path: this.#tracePath(shortestDistances, origin, destination),
      cost: shortestDistances[destination]?.cost,
    };
  }

  getAllNodes() {
    const values = [];
    this.#countries.getAll().forEach((country) => {
      values.push(country);
    });
    return values;
  }

  getAllEdges() {
    const values = [];
    for (let i = 0; i < this.#length; i += 1) {
      const origin = this.#edges[i];
      if (origin) {
        for (let j = 0; j < this.#length; j += 1) {
          const destination = origin[j];
          if (destination !== Infinity) {
            values.push({
              data: {
                source: this.#countries.getValueByIndex(i).code,
                target: this.#countries.getValueByIndex(j).code,
                value: destination,
              },
            });
          }
        }
      }
    }

    return values;
  }

  getCountryByCode(code) {
    return this.#countries.get(code);
  }
}