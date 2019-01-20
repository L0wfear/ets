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

    this.register(geoObjectsActions.getGeozoneByType, this.handleGetGeozonesByType);

    this.state = cloneDeep(initialState);
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
