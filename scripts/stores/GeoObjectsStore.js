import { Store } from 'flummox';
import _ from 'lodash';

class GeoObjectsStore extends Store {

  constructor(flux) {
    super();

    const geoObjectsActions = flux.getActions('geoObjects');

    this.register(geoObjectsActions.getODHs, this.handleGetList.bind(this, 'odhs'));
    this.register(geoObjectsActions.updateODH, this.handleGetList.bind(this, 'odhs'));
    this.register(geoObjectsActions.getSSPs, this.handleGetList.bind(this, 'ssps'));
    this.register(geoObjectsActions.getFuelingWaterStations, this.handleGetList.bind(this, 'fuelingWaterStations'));
    this.register(geoObjectsActions.getCarpools, this.handleGetList.bind(this, 'carpools'));
    this.register(geoObjectsActions.getDangerZones, this.handleGetList.bind(this, 'dangerZones'));
    this.register(geoObjectsActions.updateDT, this.handleGetList.bind(this, 'dts'));
    this.register(geoObjectsActions.getDTs, this.handleGetList.bind(this, 'dts'));
    this.register(geoObjectsActions.getGeozones, this.handleGetGeozones);

    this.state = {
      odhsList: [],
      sspsList: [],
      dtsList: [],
      fuelingWaterStationsList: [],
      carpoolsList: [],
      dangerZonesList: [],

      odhsIndex: {},
      dtsIndex: {},
      sspsIndex: {},
      fuelingWaterStationsIndex: {},
      carpoolsIndex: {},
      dangerZonesIndex: {},

      /* Геометрии */
      geozonePolys: {},
      odhPolys: {},
      dtPolys: {},
    };

  }

  handleGetList(name, {result}) {
    const statePropertyName = `${name}List`;
    this.setState({
      [statePropertyName]: result
    });
  }

  handleGetGeozones(data) {
    const geozones = data.result;
    let geozonePolys = {};
    let odhPolys = {};
    let dtPolys = {};
    geozones.map( g => {
      if (g.geozone_type === 'ROAD') {
        odhPolys[g.id] = {
          shape: JSON.parse(g.shape),
          name: g.name,
          state: 1,
        }
      }
      if (g.geozone_type === 'DT') {
        dtPolys[g.id] = {
          shape: JSON.parse(g.shape),
          name: g.name,
          state: 1,
        }
      }
      geozonePolys[g.id] = {
        shape: JSON.parse(g.shape),
        name: g.name,
        state: 1,
      }
    });
    this.setState({geozonePolys, dtPolys, odhPolys});
  }

}

export default GeoObjectsStore;
