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
    return Object.keys(REPAIR).reduce((obj, type) => Object.assign(obj, { [`${type}List`]: [] }), {});
  }
  handleChangeListActive({ listName, listNameTrue }) {
    const list = this.state[listNameTrue];
    this.setState({ [listName]: list });
  }

  handleGetList({ type, data, other }) {
    const name = this.getNameList(type, other);
    const dataRes = this.getDataForStore(type, data);

    this.setState({ [name]: dataRes.rows });
  }
  getNameList(type, other) {
    let name = type;
    if (other.name) {
      name = `${name}${other.name[0].toUpperCase()}${other.name.slice(1)}`;
    }
    return `${name}List`;
  }
  getDataForStore = (type, data = []) => this.defaultData(data);

  defaultData = ({ result = [] }) => {
    const { rows = [], extra = false } = result;
    return { rows, extra };
  }
}
