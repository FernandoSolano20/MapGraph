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
      this.#countries.set(country.code, country);
      const index = this.#countries.getIndexByKey(country.code);
      // Create the Hash method to insert the country
      // the variable i must match with the index of the hash
      this.#edges[index] = new Array(this.#length); // se cambio el i que estaba dentro del arreglo por un index
      for (let j = 0; j < this.#length; j += 1) {
        this.#edges[index][j] = Infinity; // Se cambio el i por index
      }
    }

    for (let i = 0; i < this.#length; i += 1) {
      const country = countries[i];
      const originIndex = this.#countries.getIndexByKey(country.cca3);
      // Se cambio el #getIndexByKey por el metodo hash
      country?.borders.forEach((key) => {
        const destinationIndex = this.#countries.getIndexByKey(key); // Se cambio el #getIndexByKey por el metodo hash
        if (this.#countries.get(key)?.coordinates) {
          this.#edges[originIndex][destinationIndex] = +haversine(
            this.#countries.get(country.cca3).coordinates,
            this.#countries.get(key).coordinates
          ).toFixed(2);
        }
      });
    }
  }

  #getAllAdjacencyIndexes(array) {
    return array.reduce((acc, value, index) => (value !== Infinity ? [...acc, index] : acc), []);
  }

  #formatGraph(orden) {
    const tmp = {};
    this.#edges.forEach((originEdge, originIndex) => {
      const indexes = this.#getAllAdjacencyIndexes(originEdge);
      const origin = this.#countries.getValueByIndex(originIndex);
      const values = indexes.map((index) => ({
        vertex: this.#countries.getValueByIndex(index),
        cost: originEdge[index] * orden,
      }));
      tmp[origin.code] = values;
    });
    return tmp;
  }

  #tracePath(table, start, end) {
    const path = [];
    let next = end;

    while (table[next] !== undefined) {
      path.unshift(this.#countries.get(next).name);
      if (next === start) {
        break;
      }
      next = table[next];
    }

    return path;
  }

  // https://medium.com/codex/dijkstras-algorithm-16c14151f89c
  #dijkstra(origin, destination, orden = 1) {
    const map = this.#formatGraph(orden);
    const distances = {};
    const visitedNodes = [];
    const queue = [];
    const previousVertex = {};

    for (let i = 0; i < this.#length; i += 1) {
      const code = this.#countries.getValueByIndex(i).code;
      if (code !== origin) {
        distances[code] = Infinity;
      }
    }
    distances[origin] = 0;
    previousVertex[origin] = '';
    queue.push(origin);

    while (queue.length) {
      // get the node with the smallest distance from the queue
      const currentNode = queue.shift();
      visitedNodes.push(currentNode);
      const neighbors = map[currentNode];

      // Add neighbors to the unvisited list
      const unvisitedBeighbors = neighbors.filter((n) => !visitedNodes.includes(n.vertex.code));
      const costToVertex = distances[currentNode];

      // eslint-disable-next-line no-restricted-syntax
      for (const { vertex: to, cost } of unvisitedBeighbors) {
        const currCostToNeighbor = distances[to.code];
        const newCostToNeighbor = costToVertex + cost;
        if (newCostToNeighbor < currCostToNeighbor) {
          distances[to.code] = newCostToNeighbor;
          previousVertex[to.code] = currentNode;
        }
      }

      if (unvisitedBeighbors.length) {
        const getLowestPath = unvisitedBeighbors.reduce((prev, current) =>
          distances[prev.vertex.code] < distances[current.vertex.code] ? prev : current
        );

        queue.push(getLowestPath.vertex.code);
      }
    }

    return {
      path: this.#tracePath(previousVertex, origin, destination),
      cost: (distances[destination] || 0) * orden,
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
                source: this.#countries.getValueByIndex(i)?.code,
                target: this.#countries.getValueByIndex(j)?.code,
                value: destination,
              },
            });
          }
        }
      }
    }

    return values;
  }

  getAdjacencyList(code) {
    let msj = '';
    const countriesAdjacency = [];
    const country = this.#countries.get(code);
    if (!country) {
      return 'El país no se encontró';
    }

    const originIndex = this.#countries.getIndexByKey(code);
    const origin = this.#edges[originIndex];
    for (let j = 0; j < this.#length; j += 1) {
      const destination = origin[j];
      if (destination !== Infinity) {
        countriesAdjacency.push(this.#countries.getValueByIndex(j));
      }
    }
    if (countriesAdjacency.length === 0) {
      msj = 'El país ' + country.name + ' no posee adyacencias';
    } else {
      const adyacencyNames = countriesAdjacency.map((c) => c.name);
      msj = 'El país ' + country.name + ' posee adyacencia con ' + adyacencyNames.join(', ');
    }
    return msj;
  }

  getCountryByCode(code) {
    return this.#countries.get(code);
  }

  getMinPath(origin, destination) {
    return this.#dijkstra(origin, destination);
  }

  getMaxPath(origin, destination) {
    return this.#dijkstra(origin, destination, -1);
  }
}
