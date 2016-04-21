import { Store } from 'flummox';
import _ from 'lodash';

class EmployeeStore extends Store {

  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(employeesActions.getDrivers, this.handleGetDrivers);
    this.register(employeesActions.updateEmployee, this.handleGetEmployees);
    this.register(employeesActions.createEmployee, this.handleGetEmployees);
    this.register(employeesActions.deleteEmployee, this.handleGetEmployees);

    this.state = {
      employeesList: [],
      driversList: [],
    };

  }

  handleGetEmployees({result}) {
    this.setState({employeesList: result});
	}

  handleGetDrivers({result}) {
    this.setState({driversList: result});
  }

  getEmployeeById(id) {
    return _.find(this.state.employeesList, e => e.id === id);
  }

}

export default EmployeeStore;
