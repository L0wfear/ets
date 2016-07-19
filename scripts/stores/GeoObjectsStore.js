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

      selectedPolysTypes: [],
      selectedFeature: null
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
      if (this.state.selectedFeature) {
        if (this.state.selectedFeature.featureType === type) {
          this.handleSelectFeature(null);
        }
      }
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
      let data = geozone;
      let shape = JSON.parse(geozone.shape);
      data.featureType = type;
      delete data.shape;
      polys[geozone.id] = Object.assign({}, {
        shape,
        data
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

  handleSelectFeature(selectedFeature) {
    // TODO рефакторинг
    if (selectedFeature !== null) {
      if (this.state.selectedFeature !== null) {
        const typePrev = this.state.selectedFeature.featureType;
        const polysByTypePrev = `${typePrev}Polys`;
        const polysPrev = this.state[polysByTypePrev];
        delete polysPrev[this.state.selectedFeature.id].selected;

        const type = selectedFeature.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        polys[selectedFeature.id].selected = true;
        this.setState({
          selectedFeature,
          [polysByTypePrev]: polysPrev,
          [polysByType]: polys
        });
      } else {
        const type = selectedFeature.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        polys[selectedFeature.id].selected = true;
        this.setState({
          selectedFeature,
          [polysByType]: polys
        });
      }
    } else {
      if (this.state.selectedFeature !== null) {
        const type = this.state.selectedFeature.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        delete polys[this.state.selectedFeature.id].selected;
        this.setState({
          selectedFeature,
          [polysByType]: polys
        });
      } else {
        this.setState({selectedFeature});
      }
    }
  }

  getSelectedFeature() {
    return this.state.selectedFeature;
  }

}

export default GeoObjectsStore;
