import { Store } from 'flummox';
import statuses from '../statuses.js';
import types from '../types.js';
import { getTrack } from '../adapter.js';
import { getOwnerById } from '../owners.js';

export default class PointsStore extends Store {

  constructor(flux) {
    super();

    const pointsActions = this._pointsActions = flux.getActions('points');
    const loginActions = flux.getActions('login');
    this.register(pointsActions.updatePoints, this.handleUpdatePoints);
    this.register(pointsActions.updatePointsInitial, this.handleUpdatePoints);
    this.register(pointsActions.setFilter, this.handleSetFilter);
    this.register(pointsActions.selectPoint, this.handleSelectPoint);
    this.register(pointsActions.receiveTrack, this.handleReceiveTrack);
    this.register(pointsActions.updateTrack, this.handleUpdateTrack);

    this.register(loginActions.login, this.handleLogin);

    this.state = {
      selected: null,
      points: {},
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
        1: 1
      }
    };

  }

  // @TODO подумать над рефакторингом этого метода и метода ниже
  handleUpdatePoints(update) {
    let points = Object.assign({}, this.state.points);
    let byStatus = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };
    let byConnectionStatus = {
      0: 0,
      1: 0
    };

    let keys = Object.keys(update);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];

      points[key] = Object.assign({}, this.state.points[key], update[key]);

      if (!points[key].track) {
        points[key].track = null;
      } else {
        points[key].track.push(points[key].coords);
      }


      // HACK
      if (points[key].speed !== 0 && this.state.points[key] && this.state.points[key].speed === 0) {
        points[key].coords = this.state.points[key].coords;
      }

    }

    keys = Object.keys(points);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let point = points[key];

      if (this.isPointVisible(point)) {
        byStatus[point.status]++;
        byConnectionStatus[point['connection_status']]++;
      }
    }

    this.setState({ points, byStatus, byConnectionStatus });
  }

  handleSetFilter(update) {
    let filter = Object.assign({}, this.state.filter, update);
    let selected = this.state.selected;
    let byStatus = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };
    let byConnectionStatus = {
      0: 0,
      1: 0
    };


    if (selected && !this._isPointVisible(selected, filter)) {
      selected = null;
    }

    let keys = Object.keys(this.state.points);

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let point = this.state.points[key];

      if (this._isPointVisible(point, filter)) {
        byStatus[point.status]++;
        byConnectionStatus[point['connection_status']]++;
      }
    }

    this.setState({ filter, selected, byStatus, byConnectionStatus });
  }


  handleUpdateTrack( from, to){
    let id = this.state.selected;
    getTrack(id.id, from, to ).then(track => this._pointsActions.receiveTrack(id.id, track))
  }

  handleSelectPoint(selected) {
    if (selected && ! selected.car)
      return;

    window.handleUpdateTrack = this.handleUpdateTrack.bind(this);

    if (selected && !selected.track) {
      getTrack(selected.id).then(track => this._pointsActions.receiveTrack(selected.id, track));
    }

    this.setState({ selected });
  }

  handleReceiveTrack([key, track]) {
    let point = this.state.points[key]
    point.track = track;
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

    this.setState({ filter });

  }

  getFilteredPoints() {
    return this.state.points;
  }

  isPointVisible(point) {
    return this._isPointVisible(point, this.state.filter);
  }

  _isPointVisible(point, filter) {
    let visible = true;

    if (!point.car)
      return false;

    if (filter.status) {
      visible = visible && filter.status.indexOf(point.status) !== -1;
      if (!visible) return false;
    }

    if (filter.bnso_gos && filter.bnso_gos.length > 0 ){
      let text = filter.bnso_gos.toLowerCase();
      visible = visible && (
              point.car.gps_code.toLowerCase().indexOf(text) + 1 ||
              point.car.gov_number.toLowerCase().indexOf(text) + 1
      );

      if (!visible) return false; //console.log( point )
    }


    if (filter.connectionStatus) {
      visible = visible && filter.connectionStatus.indexOf(point['connection_status']) !== -1;
      if (!visible) return false;
    }

    if (filter.type && filter.type.length > 0) {
      visible = visible && point.car && filter.type.indexOf(point.car[1]) !== -1;
      if (!visible) return false;
    }

    if (filter.owner && filter.owner.length > 0) {
      visible = visible && point.car && filter.owner.indexOf(Number(point.car[3])) !== -1;
      if (!visible) return false;
    }

    if (filter.customer && filter.customer.length > 0) {
      visible = visible && point.car && filter.customer.indexOf(point.car[4]) !== -1;
      if (!visible) return false;
    }

    if (filter.own != null) {
      visible = visible && point.car && filter.own === point.car[5];
      if (!visible) return false;
    }

    if (filter.okrug && filter.okrug.length > 0) {
      if (!point.car) return false;

      var ownerId = point.car[3];
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


}
