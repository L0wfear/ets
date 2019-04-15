import { Store } from 'flummox';
import _ from 'lodash';

export default class ObjectsStore extends Store {
  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');
    const technicalOperationsActions = flux.getActions('technicalOperation');

    this.register(objectsActions.getCars, this.handleGetCars);
    this.register(objectsActions.getSomeCars, this.handleGetSomeCars);
    this.register(objectsActions.getTypes, this.handleGetTypes);
    this.register(objectsActions.getFuelTypes, this.handleGetFuelTypes);
    this.register(objectsActions.getUserActionLog, this.handleGetUserActionLog);
    this.register(objectsActions.getMedicalStats, this.handleGetMedicalStats);
    this.register(objectsActions.getWorkMode, this.handleGetWorkMode);

    this.register(
      technicalOperationsActions.getTechnicalOperations,
      this.handleGetTechOperations,
    );
    this.register(
      technicalOperationsActions.getTechnicalOperationRelations,
      this.handleGetTechnicalOperationRelations,
    );
    this.register(
      technicalOperationsActions.getTechnicalOperationsObjects,
      this.handleGetTechnicalOperationsObjects,
    );

    this.state = {
      carsList: [],
      typesList: [],
      modelsList: [],
      fuelTypes: [],
      technicalOperationsList: [],
      technicalOperationsMap: new Map(),
      technicalOperationRelationsList: [],
      OrdersList: [],
      technicalOperationsObjectsList: [],
      positionsList: [],
      userActionLogList: [],
      medicalStatsList: [],

      carsIndex: {},
      modelsIndex: {},
      typesIndex: {},
      technicalOperationsObjectsIndex: {},

      ordersTotalCount: 0,

      workMode: [],
      workModeOptions: [],
    };
  }

  handleGetTechnicalOperationsObjects({ result: { rows = [] } = {} }) {
    rows.forEach((obj) => {
      if (obj.short_name === 'ОДХ') {
        obj.type = 'mixed';
      } else if (obj.short_name === 'ДТ') {
        obj.type = 'simple_dt';
      } else if (obj.short_name === 'ПН') {
        obj.type = 'points';
      }
    });
    this.setState({ technicalOperationsObjectsList: rows });
  }

  handleGetCars(cars) {
    const carsList = cars.result.map((c) => {
      const model = _.find(this.state.modelsList, (m) => m.id === c.model_id);
      c.model = model ? model.title : 'Н/Д';
      const type = _.find(
        this.state.typesList,
        (t) => t.asuods_id === c.type_id,
      );
      c.type = type ? type.title : 'Н/Д';
      return c;
    });
    const carsIndex = _.keyBy(carsList, 'asuods_id');
    this.setState({ carsList, carsIndex });
  }

  handleGetSomeCars(cars) {
    const carsFilterList = cars.result.rows.map((c) => {
      const model = _.find(this.state.modelsList, (m) => m.id === c.model_id);
      c.model = model ? model.title : 'Н/Д';
      const type = _.find(
        this.state.typesList,
        (t) => t.asuods_id === c.type_id,
      );
      c.type = type ? type.title : 'Н/Д';
      return c;
    });
    const carsIndex = _.keyBy(carsFilterList, 'asuods_id');
    this.setState({ carsFilterList, carsIndex });
  }

  handleGetTypes({ result: { rows = [] } }) {
    const typesList = rows;
    const typesIndex = _.keyBy(typesList, 'asuods_id');
    this.setState({ typesList, typesIndex });
  }

  handleGetFuelTypes(fuelTypes) {
    this.setState({ fuelTypes: fuelTypes.result });
  }

  handleGetTechOperations({ result }) {
    const technicalOperationsMap = new Map();
    result.forEach((to) => technicalOperationsMap.set(to.id, to));

    this.setState({
      technicalOperationsList: result,
      technicalOperationsMap,
    });
  }

  handleGetTechnicalOperationRelations({ result }) {
    this.setState({ technicalOperationRelationsList: result });
  }

  handleGetUserActionLog(userActionLogList) {
    this.setState({ userActionLogList });
  }

  handleGetMedicalStats(medicalStatsList) {
    this.setState({ medicalStatsList: medicalStatsList.result.rows });
  }

  handleGetWorkMode({ result: { rows = [] } }) {
    this.setState({
      workMode: rows,
      workModeOptions: rows.map(
        ({ id, name, start_time_text, end_time_text }) => ({
          value: id,
          label: `${name} (${start_time_text} - ${end_time_text})`,
          name,
        }),
      ),
    });
  }
}
