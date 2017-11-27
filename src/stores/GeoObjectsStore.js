import { Store } from 'flummox';
import get from 'lodash/get';

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
    // this.register(geoObjectsActions.getGeozoneByTypeWithGeometryNoJSONShape, this.handleGetGeozonesByTypeWithGeometry.bind(this, 'leak'));
    this.register(geoObjectsActions.getGeozoneByTypeWithGeometryNoJSONShape, this.handleGetGeozonesByTypeWithGeometry);
    this.register(geoObjectsActions.getGeozoneByType, this.handleGetGeozonesByType);

    this.state = {
      odhsList: [],
      sspsList: [],
      bridgessList: [],
      pedestrian_tunnelssList: [],
      pedestrian_tunnel_exitssList: [],
      fountainssList: [],
      mspsList: [],
      pgmsList: [],
      snowStoragesList: [],
      dtsList: [],
      fuelingWaterStationsList: [],
      carpoolsList: [],
      dangerZonesList: [],

      bridgessIndex: {},
      fountainssIndex: {},
      pedestrian_tunnelssIndex: {},
      pedestrian_tunnel_exitssIndex: {},
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
      bridgesPolys: {},
      fountainsPolys: {},
      pedestrian_tunnelsPolys: {},
      pedestrian_tunnel_exitsPolys: {},
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
    console.log('***store78*** type', type);  // leak
    if (type === null) {
      this.setState({ selectedPolysTypes: [] });
      this.handleSelectFeature(null);
      return;
    }
    const { selectedPolysTypes } = this.state;
    console.log('***store78*** selectedPolysTypes', selectedPolysTypes);
    const typeIndex = selectedPolysTypes.indexOf(type);
    console.log('***store78*** typeIndex', typeIndex);

    if (typeIndex > -1) {
      selectedPolysTypes.splice(typeIndex, 1);
      console.log('***store78*** this.state.selectedFeature', this.state.selectedFeature);
      if (this.state.selectedFeature) {
        console.log('***store78*** typeIndex > -1 ? this.state.selectedFeature', this.state.selectedFeature);
        console.log('***store78*** typeIndex > -1 ? this.state.selectedFeature.featureType это ', this.state.selectedFeature.featureType);
        if (this.state.selectedFeature.featureType === type) {
          this.handleSelectFeature(null);
        }
      }
    } else {
      selectedPolysTypes.push(type); // при первом нажатии "Сливы" заполняется leak в пустой  массив
    }

    this.setState({ selectedPolysTypes });
  }

  handleGetGeozones({ result }) {
    const geozones = result;
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

  handleGetGeozonesByTypeWithGeometry(response /* , nameOfType*/) {
    // console.log('nameOfType', nameOfType);
    console.log('***store133*** response', response);
    const { data = {} } = response;
    // const type = response.type || nameOfType;
    const { rows = [] } = data.result;
    const type = response.type || rows[0].type;
    console.log('***store133*** type', type);
    const polys = {};
    rows.forEach((geozone) => {
      // console.log('*****geozone.shape', geozone.shape);
      const shape = (geozone.shape.constructor === String) ? JSON.parse(geozone.shape) : geozone.shape;
      geozone.featureType = type || geozone.type;
      delete geozone.shape;
      polys[geozone.global_id || geozone.id || geozone.sensor_id] = Object.assign({}, {
        shape,
        data: geozone,
        state: 1,
      });
    });
    console.log('***store133*** polys', polys);
    const polysByType = `${type}Polys`;
    console.log('***store133*** polysByType', polysByType);

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
    console.log('***store171*** selectedPolysTypes', selectedPolysTypes); // "leak"
    const polys = {};
   selectedPolysTypes.map(type => Object.assign(polys, this.state[`${type}Polys`]));
   console.log('***store171***polys', polys);
    return polys;
  }

  handleSelectFeature(selectedFeature = false) {
    console.log('***store181*** selectedFeature', selectedFeature);
    console.log('***store181*** this.state.selectedFeature', this.state.selectedFeature);
    if (selectedFeature !== null) {
      if (this.state.selectedFeature !== null) {
        console.log('при переключении на другую точку слива топлива');
        const featureId = get(this.state, 'selectedFeature.global_id', null) || get(this.state, 'selectedFeature.id', null) || get(this.state, 'selectedFeature.sensor_id', null);
        console.log('***store181*** featureId', featureId);
        const newFeatureId = get(selectedFeature, 'global_id', null) || get(selectedFeature, 'id', null) || get(selectedFeature, 'sensor_id', null);
        console.log('***store181*** newFeatureId', newFeatureId);
        const typePrev = this.state.selectedFeature.featureType;
        const polysByTypePrev = `${typePrev}Polys`;
        const polysPrev = this.state[polysByTypePrev];
        delete polysPrev[featureId].selected;

        const type = selectedFeature.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        polys[newFeatureId].selected = true;
        this.setState({
          selectedFeature,
          [polysByTypePrev]: polysPrev,
          [polysByType]: polys,
        });
      } else {
        console.log('первоначально попадаем сюда при нажатии на точку слива топлива');
        const newFeatureId = get(selectedFeature, 'global_id', null) || get(selectedFeature, 'id', null) || get(selectedFeature, 'sensor_id', null);
        console.log('***store181*** newFeatureId', newFeatureId);
        const type = selectedFeature.featureType;
        console.log('***store181*** type', type);
        const polysByType = `${type}Polys`;
        console.log('***store181*** polysByType', polysByType);
        const polys = this.state[polysByType];
        console.log('***store181*** polys', polys);
        polys[newFeatureId].selected = true;
        this.setState({
          selectedFeature,
          [polysByType]: polys,
        });
      }
    } else if (this.state.selectedFeature !== null) {
      console.log('при снятии чекбокса');
      const featureId = get(this.state, 'selectedFeature.global_id', null) || get(this.state, 'selectedFeature.id', null) || get(this.state, 'selectedFeature.sensor_id', null);
      console.log('***store181*** featureId', featureId);
      const type = this.state.selectedFeature.featureType;
      console.log('***store181*** type', type);
      const polysByType = `${type}Polys`;
      console.log('***store181*** polysByType', polysByType);
      const polys = this.state[polysByType]; // возможно тут и определяется polys
      console.log('***store181*** polys', polys);
      delete polys[featureId].selected; // убираем выделение элемента, то есть "true" у флага selected
      this.setState({
        selectedFeature,
        [polysByType]: polys,
      });
    } else {
      this.setState({ selectedFeature });
      console.log('***store181*** !!!!!!!!!!!*', selectedFeature);
    }
  }

  getSelectedFeature() {
    return this.state.selectedFeature;
  }

}
