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
          this.#edges[originIndex][destinationIndex] = haversine(
            this.#countries.getValueByIndex(originIndex)?.coordinates,
            this.#countries.getValueByIndex(destinationIndex)?.coordinates
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
}
