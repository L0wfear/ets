import { Store } from 'flummox';

export default class GeoObjectsStore extends Store {

  constructor(flux) {
    super();

    const geoObjectsActions = flux.getActions('geoObjects');

    this.register(geoObjectsActions.getODHs, this.handleGetList.bind(this, 'odhs'));
    this.register(geoObjectsActions.updateODH, this.handleGetList.bind(this, 'odhs'));
    this.register(geoObjectsActions.updateDT, this.handleGetList.bind(this, 'dts'));
    this.register(geoObjectsActions.getDTs, this.handleGetList.bind(this, 'dts'));
    this.register(geoObjectsActions.getGeozones, this.handleGetGeozones);
    this.register(geoObjectsActions.setSelectedPolysType, this.handleSetSelectedPolysType);

    this.register(geoObjectsActions.getGeozoneByTypeWithGeometry, this.handleGetGeozonesByTypeWithGeometry);
    this.register(geoObjectsActions.getGeozoneByType, this.handleGetGeozonesByType);

    this.state = {
      odhsList: [],
      sspsList: [],
      mspsList: [],
      pgmsList: [],
      snowStoragesList: [],
      dtsList: [],
      fuelingWaterStationsList: [],
      carpoolsList: [],
      dangerZonesList: [],

      odhsIndex: {},
      dtsIndex: {},
      sspsIndex: {},
      pgmsIndex: {},
      snowStoragesIndex: {},
      fuelingWaterStationsIndex: {},
      carpoolsIndex: {},
      dangerZonesIndex: {},

      /* Геометрии */
      geozonePolys: {},
      odhPolys: {},
      dtPolys: {},
      sspPolys: {},
      mspPolys: {},
      pgmPolys: {},
      snowStoragePolys: {},
      fuelingWaterStationPolys: {},
      carpoolPolys: {},

      selectedPolysTypes: [],
      selectedFeature: null,
    };
  }

  handleGetList(name, { result }) {
    const statePropertyName = `${name}List`;
    this.setState({
      [statePropertyName]: result,
    });
  }

  handleSetSelectedPolysType(type) {
    if (type === null) {
      this.setState({ selectedPolysTypes: [] });
      this.handleSelectFeature(null);
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

    this.setState({ selectedPolysTypes });
  }

  handleGetGeozones(data) {
    const geozones = data.result;
    const geozonePolys = {};
    const odhPolys = {};
    const dtPolys = {};
    geozones.forEach((g) => {
      if (g.geozone_type === 'ROAD') {
        odhPolys[g.id] = {
          shape: JSON.parse(g.shape),
          name: g.name,
          state: 1,
        };
      }
      if (g.geozone_type === 'DT') {
        dtPolys[g.id] = {
          shape: JSON.parse(g.shape),
          name: g.name,
          state: 1,
        };
      }
      geozonePolys[g.id] = {
        shape: JSON.parse(g.shape),
        name: g.name,
        state: 1,
      };
    });
    this.setState({ geozonePolys, dtPolys, odhPolys });
  }

  handleGetGeozonesByTypeWithGeometry(response) {
    const { type, data = {} } = response;
    const { rows = [] } = data.result;
    const polys = {};
    rows.forEach((geozone) => {
      const shape = JSON.parse(geozone.shape);
      geozone.featureType = type;
      delete data.shape;
      polys[geozone.id] = Object.assign({}, {
        shape,
        data,
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

  getSelectedPolys() {
    const { selectedPolysTypes } = this.state;
    const polys = {};
    selectedPolysTypes.map(type => Object.assign(polys, this.state[`${type}Polys`]));

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
          [polysByType]: polys,
        });
      } else {
        const type = selectedFeature.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        polys[selectedFeature.id].selected = true;
        this.setState({
          selectedFeature,
          [polysByType]: polys,
        });
      }
    } else if (this.state.selectedFeature !== null) {
      const type = this.state.selectedFeature.featureType;
      const polysByType = `${type}Polys`;
      const polys = this.state[polysByType];
      delete polys[this.state.selectedFeature.id].selected;
      this.setState({
        selectedFeature,
        [polysByType]: polys,
      });
    } else {
      this.setState({ selectedFeature });
    }
  }

  getSelectedFeature() {
    return this.state.selectedFeature;
  }

}
