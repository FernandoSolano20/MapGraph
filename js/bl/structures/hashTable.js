export default class HashTable {
  #length = 0;

  #table = []; // countries

  constructor(length) {
    this.#length = length;
    this.#table = new Array(this.#length); // tabla en la que se guardan los datos
  }

  #hash(code) {
    // Se inicia una variable hash en cero
    let hash = 0;
    // Se recorre cada caracter de la clave y se eleva al cuadrado el valor ASCII de cada uno,
    // sumando el resultado a la variable hash
    for (let i = 0; i < code.length; i += 1) {
      hash += code.charCodeAt(i);
    }
    // Se calcula el índice en la tabla hash utilizando la operación módulo (%) del tamaño de la tabla hash
    let index = (hash % this.#getPrime()) - 1;
    // En caso de que haya una colisión
    // (ya existe un elemento en ese índice de la tabla hash con una clave diferente)
    while (this.#table[index] !== undefined && this.#table[index].code !== code) {
      index += 1;
    }
    // Finalmente, se devuelve el índice donde se almacenará el elemento en la tabla hash

    return index;
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

  set(code, value) {
    const indice = this.#hash(code);
    this.#table[indice] = { code, value };
  }

  get(code) {
    const hash = this.#hash(code);
    return this.#table[hash].value;
  }

  delete(code) {
    const index = this.#hash(code);

    if (this.#table[index] && this.#table[index].length) {
      this.#table[index] = [];
      return true;
    }
    return false;
  }

  getIndexByKey(code) {
    return this.#hash(code);
  }

  getValueByIndex(index) {
    return this.#table[index]?.value;
  }

  getAll() {
    return this.#table;
  }
}
