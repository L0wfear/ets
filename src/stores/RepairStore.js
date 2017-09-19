import { Store } from 'flummox';
import REPAIR from '../constants/repair';

export default class RepairStore extends Store {

  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    this.register(repairActions.getRepairListByType, this.handleGetList);
    this.register(repairActions.setActiveList, this.handleChangeListActive);

    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return Object.keys(REPAIR).reduce((obj, type) => Object.assign(obj, { [`${type}List`]: [] }), { RepairOptions: {} });
  }
  handleChangeListActive({ listName, listNameTrue }) {
    const list = this.state[listNameTrue];
    this.setState({ [listName]: list });
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
  }
  makeExtra(extra, name) {
    if (!Object.values(extra)[0]) return undefined;

    return { [`${name}Extra`]: extra };
  }
  makeOption({ makeOptions = false, selectListMapper, type }, rows) {
    if (!makeOptions) return undefined;

    const { RepairOptions } = this.state;
    RepairOptions[`${type}Options`] = rows.map(selectListMapper);
    return { RepairOptions };
  }
}
