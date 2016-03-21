import { Actions as FlummoxActions } from 'flummox';

class BaseActions extends FlummoxActions {

  constructor(props) {
    super();

    this.service = null;
  }

  get() {
    return this.service.get();
  }

  delete(id) {
    const payload = { id };
    return this.service.delete(payload);
  }

  update(payload) {
    return this.service.put(payload);
  }

  create(payload) {
    return this.service.post(payload);
  }

}

export default BaseActions;
