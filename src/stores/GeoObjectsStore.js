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
    this.register(geoObjectsActions.getGeozoneByTypeWithGeometryLeak, this.handleGetGeozonesByTypeWithGeometry);
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
      selectedPolysTypesLeak: [],

      selectedFeature: null,
      selectedFeatureLeak: null,
    };
  }

  handleGetList(name, { result }) {
    const statePropertyName = `${name}List`;
    this.setState({
      [statePropertyName]: result,
    });
  }

  handleSetSelectedPolysType(type) {
    const nameOfSelectedPolys = (type === 'leak') ? 'selectedPolysTypesLeak' : 'selectedPolysTypes';
    const nameOfSelectedFeature = (type === 'leak') ? 'selectedFeatureLeak' : 'selectedFeature';
    if (type === null) {
    //  this.setState({ selectedPolysTypes: [] }); // при клике на 'Объекты' политики очищались, а на карте пропадали активированные чекбоксом гео объекты
     // this.handleSelectFeature(null);
      return;
    }

    const selectedPolys = this.state[nameOfSelectedPolys]; // [] при первом клике
    const typeIndex = selectedPolys.indexOf(type);  // -1 при активации чекбокса
    if (typeIndex > -1) {
      selectedPolys.splice(typeIndex, 1);  // после снятия чекбокса удаляется из политик объект того типа данных, с которого снимается флажок
    const stateSelectedFeature = this.state[nameOfSelectedFeature];
    console.log('****stateSelectedFeature и тип', stateSelectedFeature, type);
      if (stateSelectedFeature) {
        if (stateSelectedFeature.featureType === type) { // если снимаем флажок с того типа объекта, который выделен на карте
          this.handleSelectFeature(null, nameOfSelectedFeature);
        }
      }
    } else {
      selectedPolys.push(type);  // пополняется объект политик при активации чекбокса
    }

    this.setState({ nameOfSelectedPolys });
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

  handleGetGeozonesByTypeWithGeometry(response) {  // данные гео объектов, полученные с сервера, записываются в отдельные свойства this.state
    const { data = {} } = response;
    const { rows = [] } = data.result;
    const type = response.type || rows[0].type;
    const polys = {};
    rows.forEach((geozone) => {
      const shape = (geozone.shape.constructor === String) ? JSON.parse(geozone.shape) : geozone.shape;
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

  getSelectedPolys(nameOfSelected) {

    const selectedPolysTypes = this.state[nameOfSelected];
    const polys = {};
    selectedPolysTypes.map(type => Object.assign(polys, this.state[`${type}Polys`]));
   // console.log('*** getSelectedPolys()***polys', polys);
    return polys;
  }


  handleSelectFeature(featureData = false, nameOfSelected) {

    const stateSelectedFeature = this.state[nameOfSelected];
    console.log('@@@@stateSelectedFeature', stateSelectedFeature); // не вызывается хендлер, если выделен гео объект, то снятие selected с иконок слива не происходит - баг
    if (featureData !== null) {
      if (stateSelectedFeature !== null) { // при переключении выбранного объекта на карте

        const featureId = get(this.state, `${nameOfSelected}.global_id`, null) || get(this.state, `${nameOfSelected}.id`, null) || get(this.state, `${nameOfSelected}.sensor_id`, null);
        const newFeatureId = get(featureData, 'global_id', null) || get(featureData, 'id', null) || get(featureData, 'sensor_id', null);
        const type = featureData.featureType;     
        const typePrev = this.state[nameOfSelected].featureType;
        const polysByTypePrev = `${typePrev}Polys`;
        const polysPrev = this.state[polysByTypePrev];
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
               
          polys[newFeatureId].selected = true;
          delete polysPrev[featureId].selected; 
          this.setState({
            [nameOfSelected]: featureData,
            [polysByTypePrev]: polysPrev,
            [polysByType]: polys,
          });
       
      } else { // при активации первого флажка

        const newFeatureId = get(featureData, 'global_id', null) || get(featureData, 'id', null) || get(featureData, 'sensor_id', null);
        const type = featureData.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        polys[newFeatureId].selected = true;
        this.setState({
          [nameOfSelected]: featureData,
          [polysByType]: polys,
        });
      }
    } else if (stateSelectedFeature !== null) { // при снятии флажка у чекбокса  и закрытии сайд-бара
      const featureId = get(this.state, `${nameOfSelected}.global_id`, null) || get(this.state, `${nameOfSelected}.id`, null) || get(this.state, `${nameOfSelected}.sensor_id`, null);
      const type = stateSelectedFeature.featureType;
      const polysByType = `${type}Polys`;
      const polys = this.state[polysByType];
      delete polys[featureId].selected;
      this.setState({
        [nameOfSelected]: featureData,
        [polysByType]: polys,
      });
    } else {
      this.setState({ [nameOfSelected]: featureData });
    }
  }

  getSelectedFeature(nameOfSelected) {

    return this.state[nameOfSelected];
  }

}
