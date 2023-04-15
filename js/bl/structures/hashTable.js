export default class HashTable {
  #table;

  #length;

  constructor(length) {
    this.#length = length;
    this.#table = new Array(this.#length);
  }

  #hash(key) {
    let sum = 0;
    for (let i = 0; i < key.length; i += 1) {
      sum += key.charCodeAt(i);
    }
    const hash = (sum % this.#getPrime()) - 1;

    return hash;
  }

  #getPrime() {
    let n = this.#length;
    if (n && 1) {
      n -= 2;
    } else {
      n -= 1;
    }

    let i;
    let j;
    for (i = n; i >= 2; i -= 2) {
      if (i % 2 !== 0) {
        for (j = 3; j <= Math.sqrt(i); j += 2) {
          if (i % j === 0) {
            break;
          }
        }
        if (j > Math.sqrt(i)) {
          return i;
        }
      }
    }
    // It will only be executed when n is 3
    return 2;
  }

  add(key, value) {
    let hash = this.#hash(key);
    if (this.#table[hash] === undefined) {
      this.#table[hash] = { key, value };
      return this.#table[hash].value;
    }
    while (this.#table[hash] !== undefined) {
      hash += 1;
    }
    this.#table[hash] = { key, value };

    return this.#table[hash].value;
  }

  get(key) {
    let hash = this.#hash(key);

    while (this.#table[hash] !== undefined) {
      if (this.#table[hash].key === key) {
        return this.#table[hash].value;
      }
      hash += 1;
    }

    return undefined;
  }

  getAll() {
    return this.#table.map((element) => element.value);
  }

  getValueByIndex(index) {
    return this.#table[index]?.value;
  }

  getIndexByKey(key) {
    let hash = this.#hash(key);

    while (this.#table[hash] !== undefined) {
      if (this.#table[hash].key === key) {
        return hash;
      }
      hash += 1;
    }

    return undefined;
  }
}
