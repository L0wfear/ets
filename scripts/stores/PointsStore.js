import { Store } from 'flummox';
import statuses from '../statuses.js';
//import types from '../types.js';
import { getTrack } from '../adapter.js';
import { getOwnerById } from '../owners.js';
import config from '../config.js';
import ReconnectingWebSocket from '../ReconnectingWebsocket.js';
//import simplify from '../vendor/simplify.js';

export default class PointsStore extends Store {

  constructor(flux) {
    super();

    const pointsActions = this._pointsActions = flux.getActions('points');
    const loginActions = flux.getActions('login');
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

    /* this.addListener('change', function(){
       console.log('I have changed', this.state);
     });
*/
    //let ws = new WebSocket(config.ws);
    let ws = new ReconnectingWebSocket(config.ws, null);

    ws.onmessage = ({data}) => {
      this.handleUpdatePoints(JSON.parse(data));
    }

    ws.onclose = (ev) => {
      global.NOTIFICATION_SYSTEM.notify('Потеряно соединение с WebSocket, пытаемся переподключиться', 'warning')
    }

    ws.onerror = (ev) => {
      global.NOTIFICATION_SYSTEM.notify('Ошибка WebSocket', 'error')
    }

  }

  handleUpdatePoints(update) {

    /**
     * TODO https://github.com/mourner/rbush
     * https://github.com/mourner/rbush-knn
     */

    let points = Object.assign({}, this.state.points);
    let selected = this.state.selected;

    for (let key in update) {
      let pointUpdate = update[key];

      // если информация в обновлении устарела - ничего не делаем
      if (key in points &&
        points[key].timestamp > pointUpdate.timestamp) {
        console.warn('got old info for point!');
        continue;
      }

      points[key] = Object.assign({}, points[key], pointUpdate);

      if (!points[key].track) {
        points[key].track = null
      } else if (!!selected && selected.id === points[key].id) {

        if (points[key].TRACK_NEEDS_UPDATE) {
          let point = {
            coords: pointUpdate.coords,
            direction: pointUpdate.direction,
            speed_avg: pointUpdate.speed,
            distance: pointUpdate.distance || 'Н/Д',
            speed_max: pointUpdate.speed_max || 'Н/Д',
            nsat: pointUpdate.nsat || 'Н/Д',
            timestamp: pointUpdate.timestamp
          };

          console.warn('continuisly updating track ')
          points[key].track.push(point);
        } else {
          console.warn('not continuisly updating track ')
        }
      }


      // HACK
      // whatever...
      if (points[key].speed !== 0 && this.state.points[key] && this.state.points[key].speed === 0) {
        points[key].coords = this.state.points[key].coords;
      }
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

    /* if (selected && !this._isPointVisible(selected, filter)) {
       selected = null;
     }*/

    let state = Object.assign({}, {
      filter,
      selected
    }, this.countDimensions());
    this.setState(state);

    // хреновое решение, но зато работает
    // решится по-другому при рефакторинге
    // TODO REFACTOR
    setTimeout(callback, 500)
  }

  handleUpdateTrack(
    from_dt = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime(),
    to_dt = new Date().getTime()) {

    let id = this.state.selected.id;

    getTrack(id, from_dt, to_dt)
      .then(track => this.handleReceiveTrack([id, track, to_dt]))
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

    if (this.state.selected && this.state.selected.track) {
      this.state.selected.track.length = 0;
    }

    selected.TRACK_NEEDS_UPDATE = true; //by default - set flag to true

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


  handleReceiveTrack([key, track, to_dt]) {
    let points = this.state.points;
    let point = points[key];
    let now = new Date();
    let dateToCheck = new Date(
      now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0
    );

    if (point.track) {
      point.track.length = 0;
    }

    if (track.length === 0) {
      console.warn('received null track for some car')
    } else {
      point.track = track; //simplify(track, .00001);
      if (point.id === this.state.selected.id) {
        point.TRACK_NEEDS_UPDATE = this.state.selected.TRACK_NEEDS_UPDATE;
        this.setState({
          selected: point
        })
      }
    }
  }

  handleLogin(user) {

    const filter = {
      status: statuses.map(s => s.id),
      type: [],
      owner: [],
      customer: [],
      okrug: [],
      own: null
    };

    if (user.role === 'prefect') {
      filter.okrug = [user.okrug];
    }

    if (user.role === 'owner') {
      filter.owner = [user.owner];
    }

    this.setState({
      filter
    });

  }

  getVisiblePoints() {
    let points = [];

    for (let k in this.state.points) {
      let point = this.state.points[k];
      if (this.isPointVisible(point)) {
        points.push(point);
      }
    }

    return points;
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
