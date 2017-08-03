import { Store } from 'flummox';
import AUTOBASE_CONSTANT from '../constants/autobase.js';

export default class AutobaseStore extends Store {

  constructor(flux) {
    super();

    const autobasesActions = flux.getActions('autobase');
    this.register(autobasesActions.getAutobaseListByType, this.handleGetList);

    this.state = this.getDefaultState();
  }

  getDefaultState() {
    return Object.keys(AUTOBASE_CONSTANT).reduce((obj, type) => Object.assign(obj, { [`${type}List`]: [] }), {});
  }

  handleGetList(res) {
    const name = `${res.type}List`;
    const { result = {} } = res.data;
    const { rows = [], extra = false } = result;

    this.setState({ [name]: rows });
    if (extra) {
      this.setState({ [`${name}Extra`]: extra });
    }
  }
}
