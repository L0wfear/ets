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

      polysObjects: [],
      polysFuels: [],
     // selectedPolysTypes: [],

      selectedFeatureObjects: null,
      selectedFeatureFuels: null,
    };
  }

  handleGetList(name, { result }) {
    const statePropertyName = `${name}List`;
    this.setState({
      [statePropertyName]: result,
    });
  }

  handleSetSelectedPolysType(type) {
    console.log('клац! type =', type);
    const feature = (type === 'leak') ? 'polysFuels' : 'polysObjects';
    console.log('%%%%% фича', feature);
    if (type === null) {
    //  this.setState({ selectedPolysTypes: [] }); // при клике на 'Объекты' политики очищались, а на карте пропадали активированные чекбоксом гео объекты
     // this.handleSelectFeature(null);
      return;
    }
    const  selectedPolysTypes = this.state[feature]; // [] при первом клике
    console.log('%%%%%%%selectedPolysTypes', selectedPolysTypes);
    const typeIndex = selectedPolysTypes.indexOf(type);  // -1 при активации чекбокса
    if (typeIndex > -1) {
      selectedPolysTypes.splice(typeIndex, 1);  // после снятия чекбокса удаляется из политик тип данныхconsole.log('##this.state.selectedFeature = ', this.state.selectedFeature);
    const stateSelectedFeature = this.state.selectedFeatureObjects || this.state.selectedFeatureFuels;
      if (stateSelectedFeature) {
        if (stateSelectedFeature.featureType === type) { // если снимаем флажок с того типа объекта, один из которых выделен на карте, что логично
          this.handleSelectFeature(null);
        }
      }
    } else {
      console.log('пополняем объект политик');
      selectedPolysTypes.push(type);  // пополняется объект политик при активации чекбокса
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

  handleGetGeozonesByTypeWithGeometry(response) {  // обрабатываются данные гео объектов, полученные с сервера
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

  getSelectedPolys(feature) {
    const selectedPolysTypes = this.state[feature];
    const polys = {};
   selectedPolysTypes.map(type => Object.assign(polys, this.state[`${type}Polys`]));
   console.log('*** getSelectedPolys()***polys', polys);
    return polys;
  }

  handleSelectFeature(selectedFeature = false, fuelOrObject = 'selectedFeatureObjects') {
    const stateSelectedFeature = this.state[fuelOrObject];
    if (selectedFeature !== null) {
      if (stateSelectedFeature !== null) { // при переключении выбранного объекта на карте
      
        const featureId = get(this.state, 'selectedFeatureObjects.global_id', null) || get(this.state, 'selectedFeatureObjects.id', null) || get(this.state, 'selectedFeatureFuels.sensor_id', null);
        const newFeatureId = get(selectedFeature, 'global_id', null) || get(selectedFeature, 'id', null) || get(selectedFeature, 'sensor_id', null);
        console.log('!!!!! newFeatureId', newFeatureId);
        const type = selectedFeature.featureType;     
        const typePrev = this.state[fuelOrObject].featureType;
        console.log('@@@@typePrev', typePrev);
        const polysByTypePrev = `${typePrev}Polys`;
        const polysPrev = this.state[polysByTypePrev];
        console.log('@@@@polysPrev', polysPrev);
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        console.log('$$$polys', polys);
               
       // if(!(type ==='leak' && typePrev !=='leak')) { // чтобы не закрывались поп-апы при закрытии сайд бара
          polys[newFeatureId].selected = true;
          delete polysPrev[featureId].selected; 
          this.setState({
            [fuelOrObject]: selectedFeature,
            [polysByTypePrev]: polysPrev,
            [polysByType]: polys,
          });
       // } else {
         // this.setState({
        //    [selectedFeature]: selectedFeature,
        //  });
       // }
      } else { // при активации первого флажка
        console.log('$$$Добро пожаловать');
        const newFeatureId = get(selectedFeature, 'global_id', null) || get(selectedFeature, 'id', null) || get(selectedFeature, 'sensor_id', null);
        const type = selectedFeature.featureType;
        const polysByType = `${type}Polys`;
        const polys = this.state[polysByType];
        polys[newFeatureId].selected = true;
        console.log('fuelOrObject', fuelOrObject);
        this.setState({
          [fuelOrObject]: selectedFeature,
          [polysByType]: polys,
        });
      }
    } else if (stateSelectedFeature !== null) { // при снятии флажка у чекббокса
      const featureId = get(this.state, 'selectedFeatureObjects.global_id', null) || get(this.state, 'selectedFeatureObjects.id', null) || get(this.state, 'selectedFeatureFuels.sensor_id', null);
      const type = stateSelectedFeature.featureType;
      const polysByType = `${type}Polys`;
      const polys = this.state[polysByType];
      delete polys[featureId].selected;
      this.setState({
        [fuelOrObject]: selectedFeature,
        [polysByType]: polys,
      });
    } else {
      this.setState({ [fuelOrObject]: selectedFeature });
    }
  }

  getSelectedFeature(feature) {
    console.log('***getSelectedFeature', this.state[feature]);
    return this.state[feature];
  }

}
