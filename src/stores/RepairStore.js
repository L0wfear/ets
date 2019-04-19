import { Store } from 'flummox';
import REPAIR from 'constants/repair';

export default class RepairStore extends Store {
  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    this.register(repairActions.getRepairListByType, this.handleGetList);
    this.register(repairActions.getObjectProperty, this.handleGetList);

    this.register(
      repairActions.getDataAboutObjectById,
      this.handlerGetDataAboutObjectById,
    );
    this.register(
      repairActions.cleartDataAboutObjectById,
      this.handlerGetDataAboutObjectById,
    );

    this.state = {
      ...this.getDefaultStateList(),
      objectPropertyList: [],
      RepairOptions: this.getDefaultOptionsIndex(),
      dataAboutObjectbyIdList: [],
    };
  }

  handlerGetDataAboutObjectById({ result: { rows: dataAboutObjectbyIdList } }) {
    this.setState({ dataAboutObjectbyIdList });
  }

  getDefaultStateList() {
    return Object.keys(REPAIR).reduce(
      (obj, type) => ({ ...obj, [`${type}List`]: [] }),
      {},
    );
  }

  getDefaultOptionsIndex() {
    return Object.keys(REPAIR).reduce(
      (obj, type) => ({ ...obj, [`${type}Options`]: [] }),
      {},
    );
  }

  handleGetList(res) {
    const name = this.getNameList(res.type, res);
    const dataRes = this.getDataForStore(res.type, res.data);
    const setStateObject = {
      [name]: dataRes.rows,
      ...this.makeExtra(dataRes.extra, name),
      ...this.makeOption(res, dataRes.rows),
    };
    this.setState({ ...setStateObject });
  }

  getNameList(type, { name = false }) {
    let nameList = type;

    if (name) {
      nameList = `${nameList}${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return `${nameList}List`;
  }

  getDataForStore = (type, data = []) => this.defaultData(data);

  defaultData = ({ result = [] }) => {
    const { rows = [], extra = false } = result;
    return { rows, extra };
  };

  makeExtra(extra, name) {
    if (!Object.values(extra)[0]) return undefined;

    return { [`${name}Extra`]: extra };
  }

  makeOption({ makeOptions = false, selectListMapper, type }, rows) {
    if (!makeOptions) return undefined;

    const RepairOptions = { ...this.state.RepairOptions };

    RepairOptions[`${type}Options`] = rows.map(selectListMapper);
    return { RepairOptions };
  }
}
