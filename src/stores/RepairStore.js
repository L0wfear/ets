import { Store } from 'flummox';
import REPAIR from '../constants/repair';

export default class RepairStore extends Store {

  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    this.register(repairActions.getRepairListByType, this.handleGetList);

    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return Object.keys(REPAIR).reduce((obj, type) => Object.assign(obj, { [`${type}List`]: [] }), {});
  }

  handleGetList(res) {
    const name = `${res.type}List`;
    const data = this.getDataForStore(res);

    this.setState({ [name]: data.rows });
    if (data.extra) {
      this.setState({ [`${name}Extra`]: data.extra });
    }
  }
  getDataForStore = ({ type, data = [] }) => {
    switch (type) {
      default:
        return this.defaultData(data);
    }
  }

  defaultData = ({ result = [] }) => {
    const { rows = [], extra = false } = result;
    return { rows, extra };
  }
}
