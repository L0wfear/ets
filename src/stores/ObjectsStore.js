import { Store } from 'flummox';
import _ from 'lodash';

export default class ObjectsStore extends Store {
  constructor(flux) {
    super();

    const objectsActions = flux.getActions('objects');
    const technicalOperationsActions = flux.getActions('technicalOperation');

    this.register(objectsActions.getCars, this.handleGetCars);
    this.register(objectsActions.getWorkMode, this.handleGetWorkMode);

    this.register(
      technicalOperationsActions.getTechnicalOperations,
      this.handleGetTechOperations,
    );
    this.register(
      technicalOperationsActions.getTechnicalOperationsObjects,
      this.handleGetTechnicalOperationsObjects,
    );

    this.state = {
      carsList: [],
      modelsList: [],
      technicalOperationsList: [],
      technicalOperationsMap: new Map(),
      OrdersList: [],
      technicalOperationsObjectsList: [],
      positionsList: [],

      carsIndex: {},
      modelsIndex: {},
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

  handleGetTechOperations({ result }) {
    const technicalOperationsMap = new Map();
    result.forEach((to) => technicalOperationsMap.set(to.id, to));

    this.setState({
      technicalOperationsList: result,
      technicalOperationsMap,
    });
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
