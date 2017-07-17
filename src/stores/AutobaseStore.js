import { Store } from 'flummox';
import AUTOBASE_CONSTANT from '../constants/autobase.js';

const org = Array(4).fill(1).map((d, i) => d = `-- демо Организация ${i}`);

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
    if (res.type == 'btr') {
      res.data.result.rows.forEach(d => {
        d.name_org = org[(d.battery__brand_id + d.battery_on_car__id) % 4];
        d.id_org = (d.battery__brand_id + d.battery_on_car__id) % 4;
      });
    }
    const name = [res.type, 'List'].join('');
    const { result } = res.data;

    this.setState({ [name]: result.rows });
  }
}
