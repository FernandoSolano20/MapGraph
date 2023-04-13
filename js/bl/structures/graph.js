import haversine from '../util/haversine';
import Country from './country';

export default class Graph {
  // Hash table to create
  #countries = [];

  #edges = null;

  #length = 0;

  constructor(countries) {
    this.#length = countries.length;
    this.#edges = new Array(this.#length);
    for (let i = 0; i < this.#length; i += 1) {
      const country = new Country(countries[i]);
      // Create the Hash method to insert the country
      // the variable i must match with the index of the hash
      this.#countries[i] = country;
      this.#edges[i] = new Array(this.#length);
      for (let j = 0; j < this.#length; j += 1) {
        this.#edges[i][j] = Infinity;
      }
    }

    for (let i = 0; i < this.#length; i += 1) {
      const country = countries[i];
      const originIndex = this.#getIndexByKey(country.cca3);
      country?.borders.forEach((key) => {
        const destinationIndex = this.#getIndexByKey(key);
        if (this.#countries[destinationIndex]?.coordinates) {
          this.#edges[originIndex][destinationIndex] = haversine(
            this.#countries[originIndex].coordinates,
            this.#countries[destinationIndex].coordinates
          ).toFixed(2);
        }
      });
    }
  }

  #getIndexByKey(key) {
    return this.#countries.findIndex((country) => country.code === key);
  }

  getAllNodes() {
    const values = [];
    this.#countries.forEach((country) => {
      values.push(country);
    });
    return values;
  }

  getAllEdges() {
    const values = [];
    for (let i = 0; i < this.#length; i += 1) {
      const origin = this.#edges[i];
      for (let j = 0; j < this.#length; j += 1) {
        const destination = origin[j];
        if (destination !== Infinity) {
          values.push({
            data: {
              source: this.#countries[i].code,
              target: this.#countries[j].code,
              value: destination,
            },
          });
        }
      }
    }

    return values;
  }
}
