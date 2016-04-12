import { Store } from 'flummox';
import _ from 'lodash';

class EmployeeStore extends Store {

  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(employeesActions.updateEmployee, this.handleGetEmployees);
    this.register(employeesActions.createEmployee, this.handleGetEmployees);
    this.register(employeesActions.deleteEmployee, this.handleGetEmployees);

    this.state = {
      employeesList: [],
      driversList: [],
    };

  }

  handleGetEmployees(employees) {
    const employeesList = employees.result;
    this.setState({employeesList, driversList: employeesList.filter( e => e.position_id === 15)});
	}

  getEmployeeById(id) {
    return _.find(this.state.employeesList, e => e.id === id);
  }

}

export default EmployeeStore;
