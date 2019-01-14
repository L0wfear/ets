import { Store } from 'flummox';
import AUTOBASE_CONSTANT from '../constants/autobase';

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
      ...this.makeExtra(data.extra, name),
      ...this.makeOption(res, data.rows),
    };

    this.setState({ ...setStateObject });
  }

  getDataForStore = ({ type, data = [] }) => {
    switch (type) {
      case 'tire':
        return this.tireCustomId(data);
      default:
        return this.defaultData(data);
    }
  }

  tireCustomId = ({ result = [] }) => {
    const {
      rows = [],
      extra = {},
    } = result;

    const newRows = [...rows.map((row) => {
      const { tire_to_car } = row;
      const newtire_to_car = tire_to_car.map((item, index) => ({
        ...item,
        customId: index + 1,
      }));
      return {
        ...row,
        tire_to_car: newtire_to_car,
      };
    })];
    return { rows: newRows, extra };
  }

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

    const AutobaseOptions = { ...this.state.AutobaseOptions };

    AutobaseOptions[`${type}Options`] = rows.map(selectListMapper);

    return { AutobaseOptions };
  }
}
