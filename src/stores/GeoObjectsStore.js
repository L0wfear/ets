import { Store } from 'flummox';
import cloneDeep from 'lodash/cloneDeep';

const initialState = {
  bridgesList: [],
  pedestrian_tunnelssList: [],
  pedestrian_tunnel_exitssList: [],
  fountainssList: [],
  pgmsList: [],
  snowStoragesList: [],
  fuelingWaterStationsList: [],
  dangerZonesList: [],

  /* Геометрии */
  odhPolys: {},
  dtPolys: {},
};

export default class GeoObjectsStore extends Store {
  constructor(flux) {
    super();

    const geoObjectsActions = flux.getActions('geoObjects');

    this.register(geoObjectsActions.getGeozoneByTypeWithGeometry, this.handleGetGeozonesByTypeWithGeometry);
    this.register(geoObjectsActions.getGeozoneByType, this.handleGetGeozonesByType);

    this.state = cloneDeep(initialState);
  }

  handleGetGeozonesByTypeWithGeometry(response) { // данные гео объектов, полученные с сервера, записываются в отдельные свойства this.state
    const { data = {} } = response;
    const { rows = [] } = data.result;
    const type = response.type || rows[0].type;
    const polys = {};
    rows.forEach((geozone) => {
      let shape = {};
      try {
        shape = JSON.parse(geozone.shape);
      } catch (e) {
        shape = geozone.shape;
      }

      geozone.featureType = type || geozone.type;
      delete geozone.shape;
      polys[geozone.global_id || geozone.id || geozone.sensor_id] = Object.assign({}, {
        shape,
        data: geozone,
        state: 1,
      });
    });
    const polysByType = `${type}Polys`;

    this.setState({
      [polysByType]: polys,
    });
  }

  handleGetGeozonesByType(response) {
    const { type, data = {} } = response;
    const { rows = [] } = data.result;
    const typeList = `${type}sList`;
    this.setState({
      [typeList]: rows,
    });
  }
}
