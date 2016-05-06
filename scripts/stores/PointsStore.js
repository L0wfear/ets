import { Store } from 'flummox';
import statuses from '../statuses.js';
import { getOwnerById } from '../owners.js';
import config from '../config.js';
import ReconnectingWebSocket from '../vendor/ReconnectingWebsocket.js';
import _ from 'lodash';

let initialState = {
    selected: null,
    points: {},
    totalOnline: 0,
    filter: {
      connectionStatus: [0, 1],
      status: statuses.map(s => s.id),
      type: [],
      owner: [],
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
    trackingMode: false,
    showTrackingGradient: false,
    isRenderPaused: false,
    singleCarTrack: null,
    singleCarTrackDates: [],
}

export default class PointsStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;

    const pointsActions = this._pointsActions = flux.getActions('points');
    const loginActions = flux.getActions('session');
    this.register(pointsActions.updatePoints, this.handleUpdatePoints);
    this.register(pointsActions.setFilter, this.handleSetFilter);
    this.register(pointsActions.selectPoint, this.handleSelectPoint);
    this.register(pointsActions.setTracking, this.setTracking);
    this.register(pointsActions.getPointsExtent, this.getPointsExtent);
    this.register(pointsActions.createConnection, this.handleCreateConnection);
    this.register(pointsActions.createConnectionForSinglePoint, this.handleCreateConnectionForSinglePoint);
    this.register(pointsActions.closeConnection, this.handleCloseConnection);
    this.register(pointsActions.setSingleCarTrack, this.handleSetSingleCarTrack);
    this.register(pointsActions.setSingleCarTrackDates, this.handleSetSingleCarTrackDates);

    this.register(loginActions.login, this.handleLogin);


    this.state = _.cloneDeep(initialState);

  }

  handleCreateConnection() {
    console.info('CREATING WS CONNECTION');
    //this.setState(_.cloneDeep(initialState));
    const token = this.flux.getStore('session').getSession();
    let wsUrl = `${config.ws}?token=${token}`;
    this.ws = new ReconnectingWebSocket(wsUrl, null);

    this.ws.onmessage = ({data}) => {
      this.handleUpdatePoints(JSON.parse(data));
    }

    this.ws.onclose = () => {
      //global.NOTIFICATION_SYSTEM.notify('Потеряно соединение с WebSocket, пытаемся переподключиться', 'warning');
    }

    this.ws.onerror = () => {
      //global.NOTIFICATION_SYSTEM.notify('Ошибка WebSocket', 'error');
    }

    this.unpauseRendering();
  }

  handleCloseConnection() {
    console.info('CLOSING WS CONNECTION');
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
      this.ws = null;
    }
    this.setState(_.cloneDeep(initialState));
    this.pauseRendering();
  }

  handleSetSingleCarTrack(car_gov_number) {
    this.setState({singleCarTrack: car_gov_number});
  }

  handleSetSingleCarTrackDates(dates) {
    this.setState({singleCarTrackDates: dates});
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

    if (this.state.singleCarTrack) {
      if (!this.state.selected) {
        _.map(points, p => {
          let car = p.car;
          if (car && car.gov_number === this.state.singleCarTrack && p.marker) { // заменить на car.gps_code
            p.marker.createTrack();
            p.marker.track.fetch(this.state.singleCarTrackDates[0] || undefined, this.state.singleCarTrackDates[1] || undefined);
            this.handleSelectPoint(p);
          }
        });
      }
    }

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

  handleSetFilter(update) {
    let filter = Object.assign({}, this.state.filter, update);
    let selected = this.state.selected;

    this.setState(Object.assign({}, {filter, selected}, this.countDimensions()));
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

  handleLogin({payload}) {
    this.handleSetFilter({owner: [payload.company_id]});
  }

  getPointsExtent() {
    let minX = 100000,
      minY = 100000,
      maxX = 0,
      maxY = 0;

    let points = this.getVisiblePoints();

    for (let key in points) {
      let point = points[key];
      let [x, y] = point.coords_msk;

      if (x < minX) {
        minX = x
      }
      if (x > maxX) {
        maxX = x
      }

      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y
      }
    }

    return [minX, minY, maxX, maxY];
  }

  getVisiblePoints() {
    let returns = [];

    for (let k in this.state.points) {
      let point = this.state.points[k];
      if (this.isPointVisible(point)) {
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

    return visible;
  }

  getSelectedMarker() {
    if (this.state.selected) {
      return this.state.selected.marker;
    } else {
      return null;
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
    //return false;
    return this.state.isRenderPaused;
  }

}
