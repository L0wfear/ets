import { Store } from 'flummox';

class EmployeeStore extends Store {

  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(employeesActions.updateEmployee, this.handleGetEmployees);

    this.state = {
      employeesList: [],
      driversList: [],
    };

  }

  handleGetEmployees(employees) {
    const employeesList = employees.result;
    this.setState({employeesList, driversList: employeesList.filter( e => e.position_id === 15)});
	}

}

export default EmployeeStore;
