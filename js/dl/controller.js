import Business from '../bl/business';

export default class Controller {
  #bl;

  constructor() {
    this.#bl = new Business();
  }
}
