import { Actions } from 'flummox';

export default class StreamAction extends Actions {
  initLink(token, type, wsUrl) {
    return {
      type,
      token,
      wsUrl,
    };
  }

  updateData(type, data) {
    return {
      type,
      data,
    };
  }

  closeLink(type) {
    return {
      type,
    }
  }
}
