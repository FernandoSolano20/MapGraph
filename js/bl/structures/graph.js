import haversine from '../util/haversine';
import Country from './country';

export default class Graph {
  #values = {};

  #edges = null;

  #length = 0;

  constructor(countries) {
    this.#length = countries.length;
    this.#edges = new Array(this.#length);
    for (let i = 0; i < this.#length; i += 1) {
      const country = new Country(countries[i]);
      this.#values[country.code] = country;
      this.#edges[i] = new Array(this.#length);
      for (let j = 0; j < this.#length; j += 1) {
        this.#edges[i][j] = Infinity;
      }
    }

    const keys = this.#getKeys();
    keys.forEach((origin, indexOrigin) => {
      keys.forEach((destination, indexDestination) => {
        if (this.#values[origin].borders.includes(destination)) {
          this.#edges[indexOrigin][indexDestination] = haversine(
            this.#values[origin].coordinates,
            this.#values[destination].coordinates
          ).toFixed(2);
        }
      });
    });
  }

  #getKeys() {
    return Object.keys(this.#values);
  }

  getAllNodes() {
    const keys = this.#getKeys();
    const values = [];
    keys.forEach((key) => values.push(this.#values[key]));
    return values;
  }

  getAllEdges() {
    const values = [];
    const keys = this.#getKeys();
    for (let i = 0; i < this.#length; i += 1) {
      const origin = this.#edges[i];
      for (let j = 0; j < this.#length; j += 1) {
        const destination = origin[j];
        if (destination !== Infinity) {
          values.push({
            data: {
              source: keys[i],
              target: keys[j],
              value: destination,
            },
          });
        }
      }
    }

    return values;
  }
}
