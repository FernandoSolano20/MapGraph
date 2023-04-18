import HashTable from './hashTable';
import haversine from '../util/haversine';
import Country from './country';

export default class Graph {
  // Hash table to create
  #countries;

  #edges = null;

  #length = 0;

  constructor(countries) {
    this.#length = countries.length;
    this.#edges = new Array(this.#length);
    this.#countries = new HashTable(this.#length); // Se cambio el .length por el  #hashTableSize
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
          this.#edges[originIndex][destinationIndex] = haversine(
            this.#countries.get(country.cca3).coordinates,
            this.#countries.get(key).coordinates
          ).toFixed(2);
        }
      });
    }
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

    return values;
  }
}
