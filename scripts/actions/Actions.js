import { Actions as FlummoxActions } from 'flummox';

class BaseActions extends FlummoxActions {

  constructor(props) {
    super();

    this.service = null;
    console.log(this)
  }

  get() {
    return this.service.get();
  }

  delete(id) {
    const payload = { id };
    return this.service.delete(payload);
  }

  update(payload) {
    return this.service.update(payload);
  }

  create(payload) {
    return this.service.create(payload);
  }

}

export default BaseActions;
