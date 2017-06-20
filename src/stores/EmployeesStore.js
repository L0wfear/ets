import { Store } from 'flummox';

export default class EmployeeStore extends Store {

  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(employeesActions.getWaybillDrivers, this.handleGetWaybillDrivers);
    this.register(employeesActions.getDrivers, this.handleGetDrivers);
    this.register(employeesActions.updateEmployee, this.handleGetEmployees);
    this.register(employeesActions.createEmployee, this.handleGetEmployees);
    this.register(employeesActions.deleteEmployee, this.handleGetEmployees);

    this.state = {
      employeesList: [],
      driversList: [],
      waybillDriversList: [],
    };
  }

  handleGetEmployees({ result }) {
    this.setState({ employeesList: result });
  }

  handleGetDrivers({ result }) {
    this.setState({ driversList: result });
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }

}
