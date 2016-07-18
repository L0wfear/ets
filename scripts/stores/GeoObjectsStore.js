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
    this.register(geoObjectsActions.setSelectedPolysType, this.handleSetSelectedPolysType);

    this.register(geoObjectsActions.getGeozoneByTypeWithGeometry, this.handleGetGeozonesByType);

    this.state = {
      odhsList: [],
      sspsList: [],
      dtsList: [],
      fuelingWaterStationsList: [],
      carpoolsList: [],
      dangerZonesList: [],
      mspsList: [],

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
      sspPolys: {},
      mspPolys: {},
      fuelingWaterStationPolys: {},
      carpoolPolys: {},

      selectedPolysTypes: []
    };

  }

  handleGetList(name, {result}) {
    const statePropertyName = `${name}List`;
    this.setState({
      [statePropertyName]: result
    });
  }

  handleSetSelectedPolysType(type) {
    if (type === null) {
      this.setState({selectedPolysTypes: []});
      return;
    }
    const { selectedPolysTypes } = this.state;
    const typeIndex = selectedPolysTypes.indexOf(type);

    if (typeIndex > -1) {
      selectedPolysTypes.splice(typeIndex, 1);
    } else {
      selectedPolysTypes.push(type);
    }

    this.setState({selectedPolysTypes});
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

  handleGetGeozonesByType(response) {
    const { type, data = {} } = response;
    const { result = [] } = data;
    const polys = {};
    result.map(geozone => {
      polys[geozone.id] = Object.assign({}, geozone, {
        shape: JSON.parse(geozone.shape),
      });
    });
    const polysByType = `${type}Polys`;

    this.setState({
      [polysByType]: polys
    });
  }

  getSelectedPolys() {
    const { selectedPolysTypes } = this.state;
    let polys = {};
    selectedPolysTypes.map(type => {
      Object.assign(polys, this.state[`${type}Polys`]);
    });

    return polys;
  }

}

export default GeoObjectsStore;
