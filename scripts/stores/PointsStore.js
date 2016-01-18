import { Store } from 'flummox';
import statuses from '../statuses.js';
import { getOwnerById } from '../owners.js';
import config from '../config.js';
import ReconnectingWebSocket from '../vendor/ReconnectingWebsocket.js';

export default class PointsStore extends Store {

  constructor(flux) {
    super();

    const pointsActions = this._pointsActions = flux.getActions('points');
    const loginActions = flux.getActions('session');
    this.register(pointsActions.updatePoints, this.handleUpdatePoints);
    this.register(pointsActions.setFilter, this.handleSetFilter);
    this.register(pointsActions.selectPoint, this.handleSelectPoint);
    this.register(pointsActions.receiveTrack, this.handleReceiveTrack);
    this.register(pointsActions.updateTrack, this.handleUpdateTrack);
    this.register(pointsActions.setShowPlates, this.handleSetShowPlates);
    this.register(pointsActions.setTracking, this.setTracking);

    this.register(loginActions.login, this.handleLogin);

    this.state = {
      selected: null,
      points: {},
      totalOnline: 0,
      filter: {
        connectionStatus: [0, 1],
        status: statuses.map(s => s.id),
        type: [],
        owner: [],
        customer: [],
        okrug: [],
        own: null
      },
      byStatus: {
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      byConnectionStatus: {
        0: 0,
        1: 0
      },
      showPlates: false, // TODO move to settings store
      trackingMode: false,
      showTrackingGradient: false,
      isRenderPaused: false
    };

    let ws = new ReconnectingWebSocket(config.ws, null);

    ws.onmessage = ({data}) => {
      this.handleUpdatePoints(JSON.parse(data));
    }

    ws.onclose = () => {
      global.NOTIFICATION_SYSTEM.notify('Потеряно соединение с WebSocket, пытаемся переподключиться', 'warning')
    }

    ws.onerror = () => {
      //global.NOTIFICATION_SYSTEM.notify('Ошибка WebSocket', 'error')
    }

  }


  /**
    @todo handleMessage() method
   **/
  handleUpdatePoints(update) {

    /**
     * TODO https://github.com/mourner/rbush
     * https://github.com/mourner/rbush-knn
     */

    let points = Object.assign({}, this.state.points);

    for (let key in update) {
      let pointUpdate = update[key];

      // если информация в обновлении устарела - ничего не делаем
      if (key in points &&
        points[key].timestamp > pointUpdate.timestamp) {
        console.warn('got old info for point!');
        continue;
      }

      points[key] = Object.assign({}, points[key], pointUpdate);


      // HACK
      // whatever...
      /*if (points[key].speed !== 0 && this.state.points[key] && this.state.points[key].speed === 0) {
        points[key].coords = this.state.points[key].coords;
      }*/

    }

    let state = Object.assign({}, {
      points
    }, this.countDimensions());

    this.setState(state);
  }

  countDimensions() {

    if (this.state.isRenderPaused) {
      return
    }

    let points = this.state.points;

    let byStatus = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    let byConnectionStatus = {
      0: 0,
      1: 0
    }

    for (let key in points) {
      let point = points[key];
      if (this.isPointVisible(point)) {
        byStatus[point.status]++;
        byConnectionStatus[point.connection_status]++;
      }
    }

    return {
      byStatus,
      byConnectionStatus
    };
  }

  handleSetFilter(update, callback = () => {}) {
    let filter = Object.assign({}, this.state.filter, update);
    let selected = this.state.selected;

    this.setState(Object.assign({}, {filter, selected}, this.countDimensions()));
    callback()
  }


  handleSelectPoint(selected) {

    if (!!selected === false) {
      this.setState({
        selected: false
      });
      return;
    }

    if (selected && !selected.car) {
      return
    }

    this.setState({
      selected,
      trackingMode: false
    });
  }

  toggleSelectedPointTrackUpdating(flag) {
    let point = this.state.selected;
    point.TRACK_NEEDS_UPDATE = flag;
    this.setState({
      selected: point
    })
  }

  handleLogin(user) {
    // const filter = {
    //   status: statuses.map(s => s.id),
    //   type: [],
    //   owner: [],
    //   customer: [],
    //   okrug: [],
    //   own: null
    // };
    //
    // if (user.role === 'prefect') {
    //   filter.okrug = [user.okrug];
    // }
    //
    // if (user.role === 'owner') {
    //   filter.owner = [user.owner];
    // }
    //
    // this.setState({
    //   filter
    // });

  }

  getVisiblePoints() {
    let returns = [];

    for (let k in this.state.points){
      let point = this.state.points[k];
      if (this.isPointVisible(point)){
        returns.push(point)
      }
    }

    return returns;
  }

  isPointVisible(point) {
    return this._isPointVisible(point, this.state.filter);
  }

  setTracking(value) {
    this.setState({
      trackingMode: value
    })
  }

  handleSetShowGradient(flag) {
    this.setState({
      showTrackingGradient: flag
    })
  }

  handleSetShowPlates(showPlates) {
    this.setState({
      showPlates
    })
  }

  _isPointVisible(point, filter) {
    let visible = true;

    if (!point.car)
      return false;

    if (!filter) return visible;

    // return true for selected point anyway
    if (this.state.selected !== null && point.id === this.state.selected.id) return true;

    if (filter.status) {
      visible = visible && filter.status.indexOf(point.status) !== -1;
      if (!visible) return false;
    }

    if (filter.bnso_gos && filter.bnso_gos.length > 0) {
      let text = filter.bnso_gos.toLowerCase();
      visible = visible && (
        point.car.gps_code.toLowerCase().indexOf(text) + 1 ||
        point.car.gov_number.toLowerCase().indexOf(text) + 1
      );

      if (!visible) return false;
    }

    if (filter.connectionStatus) {
      visible = visible && filter.connectionStatus.indexOf(point.connection_status) !== -1;
      if (!visible) return false;
    }

    if (filter.type && filter.type.length > 0) {
      visible = visible && point.car && filter.type.indexOf(point.car.type_id) !== -1;
      if (!visible) return false;
    }

    if (filter.owner && filter.owner.length > 0) {
      visible = visible && point.car && filter.owner.indexOf(Number(point.car.owner_id)) !== -1;
      if (!visible) return false;
    }

    if (filter.customer && filter.customer.length > 0) {
      visible = visible && point.car && filter.customer.indexOf(point.car.customer_id) !== -1;
      if (!visible) return false;
    }

    if (filter.own != null) {
      visible = visible && point.car && filter.own === point.car.owner_id;
      if (!visible) return false;
    }

    if (filter.okrug && filter.okrug.length > 0) {
      if (!point.car) return false;

      var ownerId = point.car.owner_id;
      var owner = getOwnerById(ownerId);

      if (!owner) return false;


      var okrugs = owner.okrugs;

      visible = visible && okrugs.some(okrug => filter.okrug.indexOf(okrug) !== -1);

      if (!visible) return false;
    }

    return visible;
  }

  getSelectedMarker() {
    if (this.state.selected) {
      return this.state.selected.marker;
    } else {
      return null
    }
  }

  hasMarkerSelected() {
    return this.state.selected !== false && this.state.selected !== null;
  }

  getSelectedPoint() {
    return this.state.selected;
  }

  pauseRendering() {
    this.setState({
      isRenderPaused: true
    })
  }

  unpauseRendering() {
    this.setState({
      isRenderPaused: false
    })
  }

  isRenderPaused() {
    return false;
    return this.state.isRenderPaused;
  }

}
