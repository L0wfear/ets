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
    return Object.keys(AUTOBASE_CONSTANT).reduce((obj, name) => Object.assign(obj, { [[name, 'List'].join('')]: [] }), {});
  }

  handleGetList(res) {
    const name = [res.type, 'List'].join('');
    const { result } = res.data;

    this.setState({ [name]: result.rows });
  }
}
