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
    const data = this.getDataForStore(res);

    this.setState({ [name]: data.rows });
    if (data.extra) {
      this.setState({ [`${name}Extra`]: data.extra });
    }
  }
  getDataForStore = ({ type, data = [] }) => {
    switch (type) {
      case 'roadAccidentRegistry':
        return this.roadAccident(data);
      default:
        return this.defaultData(data);
    }
  }

  roadAccident = ({ result = [] }) => {
    const {
      rows = [],
      extra = false,
    } = result;
    const newRows = [...rows.map((row) => {
      let {
        driver_fio = '',
        employee_position_name = '',
        drivers_license = '',
        special_license = '',
      } = row;
      driver_fio = (!!driver_fio && driver_fio) || '';
      employee_position_name = (!!employee_position_name && employee_position_name) || '';
      drivers_license = (!!drivers_license && drivers_license) || '';
      special_license = (!!special_license && special_license) || '';

      return {
        ...row,
        drivers_emplds: `${driver_fio} | ${employee_position_name} ${drivers_license}${(drivers_license !== '' && ' ') || ''}${special_license}`,
      };
    })];
    return { rows: newRows, extra };
  }
  defaultData = ({ result = [] }) => {
    const { rows = [], extra = false } = result;
    return { rows, extra };
  }
}
