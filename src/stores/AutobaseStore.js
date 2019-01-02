import { Store } from 'flummox';
import AUTOBASE_CONSTANT from 'constants/autobase';

export default class AutobaseStore extends Store {
  constructor(flux) {
    super();

    const autobasesActions = flux.getActions('autobase');
    this.register(autobasesActions.getAutobaseListByType, this.handleGetList);

    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return Object.keys(AUTOBASE_CONSTANT).reduce((obj, type) => Object.assign(obj, { [`${type}List`]: [] }), { AutobaseOptions: {} });
  }

  handleGetList(res) {
    const name = `${res.type}List`;
    const data = this.getDataForStore(res);

    const setStateObject = {
      [name]: data.rows,
      ...this.makeExtra(data.extra, name), // реестр ТО
    };

    this.setState({ ...setStateObject });
  }

  getDataForStore = ({ type, data = [] }) => {
    this.defaultData(data);
  }

  defaultData = ({ result = [] }) => {
    const { rows = [], extra = false } = result;
    return { rows, extra };
  }

  makeExtra(extra, name) {
    if (!Object.values(extra)[0]) return undefined;

    return { [`${name}Extra`]: extra };
  }
}
