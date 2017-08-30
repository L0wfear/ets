import { Store } from 'flummox';

export default class EmployeeStore extends Store {

  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(employeesActions.getWaybillDrivers, this.handleGetWaybillDrivers);
    this.register(employeesActions.getDrivers, this.handleGetDrivers);
    this.register(employeesActions.getForemans, this.handleGetForemans);
    this.register(employeesActions.updateEmployee, this.handleGetEmployees);
    this.register(employeesActions.createEmployee, this.handleGetEmployees);
    this.register(employeesActions.deleteEmployee, this.handleGetEmployees);

    this.state = {
      employeesList: [],
      driversList: [],
      foremanList: [],
      waybillDriversList: [],
    };
  }

  handleGetEmployees({ result }) {
    this.setState({ employeesList: result });
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
