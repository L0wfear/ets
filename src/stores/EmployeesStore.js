import { Store } from 'flummox';
import keyBy from 'lodash/keyBy';

export default class EmployeeStore extends Store {

  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(employeesActions.getEmployeeBindedToCar, this.handleGetEmployeeBindedToCar);
    this.register(employeesActions.getEmployeeOnCarList, this.handleGetEmployeeOnCarList);
    this.register(employeesActions.getWaybillDrivers, this.handleGetWaybillDrivers);
    this.register(employeesActions.getDrivers, this.handleGetDrivers);
    this.register(employeesActions.getForemans, this.handleGetForemans);
    this.register(employeesActions.updateEmployee, this.handleGetEmployees);
    this.register(employeesActions.createEmployee, this.handleGetEmployees);
    this.register(employeesActions.deleteEmployee, this.handleGetEmployees);

    this.state = {
      employeesList: [],
      employeesIndex: {},
      employeesBindedoOCarList: [],
      employeesBindedoOCarIndex: {},
      employeeOnCarList: [],
      driversList: [],
      foremanList: [],
      waybillDriversList: [],
    };
  }

  handleGetEmployees({ result }) {
    const data = result.map(empl => ({
      ...empl,
      active: !!empl.active,
    }));

    this.setState({
      employeesList: data,
      employeesIndex: keyBy(data, 'id'),
    });
  }

  handleGetEmployeeBindedToCar(result) {
    this.setState({
      employeesBindedoOCarList: result,
      employeesBindedoOCarIndex: keyBy(result, 'employee_id'),
    });
  }

  handleGetEmployeeOnCarList({ result }) {
    this.setState({ employeeOnCarList: result.map((row, index) => ({ ...row, _uniq_field: index })) });
  }

  handleGetDrivers({ result }) {
    const newResult = this.setDopPropsInDrivers(result);
    this.setState({ driversList: newResult });
  }

  handleGetForemans({ result }) {
    this.setState({ foremanList: result });
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }

  setDopPropsInDrivers(result = []) {
    return result.map((row) => {
      let {
        position_name = '',
        drivers_license = '',
        special_license = '',
      } = row;

      position_name = (!!position_name && position_name) || '';
      drivers_license = (!!drivers_license && drivers_license) || '';
      special_license = (!!special_license && special_license) || '';

      return {
        ...row,
        drivers_emplds: `${position_name} ${drivers_license}${(drivers_license !== '' && ' ') || ''}${special_license}`,
      };
    });
  }

}
