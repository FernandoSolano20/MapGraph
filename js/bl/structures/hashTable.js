export default class HashTable {

    #length = 0;

    #tabla = [];// countries

    // this.#countries = new Array(this.#length);// Se cambio el .length por el  #hashTableSize


    constructor(length) {
        this.#length=length
        this.tabla = new Array(this.#length);// tabla en la que se guardan los datos
       
    }

    #hash(llave) {
        // Se inicia una variable hash en cero
        let hash = 0;
        // Se recorre cada caracter de la clave y se eleva al cuadrado el valor ASCII de cada uno,
        // sumando el resultado a la variable hash
        for (let i = 0; i < llave.length; i += 1) {
            hash += llave.charCodeAt(i) ** 2;
        }
        // Se calcula el índice en la tabla hash utilizando la operación módulo (%) del tamaño de la tabla hash
        let index = hash % this.#length;
        // En caso de que haya una colisión 
        // (ya existe un elemento en ese índice de la tabla hash con una clave diferente)
        while (this.#tabla[index] !== undefined && this.#tabla[index].code !== llave) {
            index = (index + 1) % this.#length;
        }
        // Finalmente, se devuelve el índice donde se almacenará el elemento en la tabla hash 

        return index;
    }

    set(llave, valor) {
        const indice = this.#hash(llave);
        this.tabla[indice] = [llave, valor];
    }

    get(llave) {
        const objetivo = this.#hash(llave);
        return this.table[objetivo];
    }

    remover(llave) {
        const indice = this.#hash(llave);

        if (this.tabla[indice] && this.tabla[indice].length) {
            this.tabla[indice] = [];
            return true;
        }
        return false;

    }

    getIndexByKey(llave){
     return  this.#hash(llave);
    }

    getAll(){
        return this.#tabla;
    }
}


