import { Store } from 'flummox';
import ReconnectingWebSocket from '../vendor/ReconnectingWebsocket.js';

export default class StreamStore extends Store {

  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    this.register(repairActions.initLink, this.handleInitLink);
    this.register(repairActions.updateData, this.handleUpdateData);
    this.register(repairActions.closeLink, this.handleCloseLink);

    this.state = {
      cars: {
        socket: false,
        data: {},
      },
    };
  }

  handleInitLink({ type, wsUrl }) {
    const newWs = new ReconnectingWebSocket(wsUrl, null);

    this.setState({
      [type]: {
        socket: newWs,
        data: {},
      },
    });
  }

  handleUpdateData({ type, data }) {
    const { data: oldData } = this.state[type];

    this.setState({
      [type]: {
        data: {
          ...oldData,
          ...data,
        },
      },
    });
  }

  handleCloseLink(type) {
    const { socket = false, data = {} } = this.state[type];
    if (socket) {
      socket.close();
      Object.keys(data).forEach(key => delete data[key]);
      this.setState({
        [type]: {
          socket: false,
          data: {},
        },
      });
    }
  }

}
