export default class HashTable {
  #length = 0;

  #table = []; // countries

  constructor(length) {
    this.#length = length;
    this.#table = new Array(this.#length); // tabla en la que se guardan los datos
  }

  #hash(key) {
    // Se inicia una variable hash en cero
    let sum = 0;
    // Se recorre cada caracter de la clave y se eleva al cuadrado el valor ASCII de cada uno,
    // sumando el resultado a la variable hash
    for (let i = 0; i < key.length; i += 1) {
      sum += key.charCodeAt(i);
    }
    // Se calcula el índice en la tabla hash utilizando la operación módulo (%) del tamaño de la tabla hash
    let hash = (sum % this.#getPrime()) - 1;
    // En caso de que haya una colisión
    // (ya existe un elemento en ese índice de la tabla hash con una clave diferente)
    while (this.#table[hash] !== undefined && this.#table[hash].key !== key) {
      hash += 1;
    }
    // Finalmente, se devuelve el índice donde se almacenará el elemento en la tabla hash

    return hash;
  }

  #getPrime() {
    let n = this.#length;
    // All prime numbers are odd except two
    // eslint-disable-next-line no-bitwise
    if (n & 1) {
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

  set(key, value) {
    const hash = this.#hash(key);
    this.#table[hash] = { key, value };
  }

  get(key) {
    const hash = this.#hash(key);
    return this.#table[hash].value;
  }

  delete(key) {
    const index = this.#hash(key);

    if (this.#table[index] && this.#table[index].length) {
      this.#table[index] = [];
      return true;
    }
    return false;
  }

  getIndexByKey(key) {
    return this.#hash(key);
  }

  getValueByIndex(key) {
    return this.#table[key]?.value;
  }

  getAll() {
    return this.#table.map((element) => element.value);
  }
}
