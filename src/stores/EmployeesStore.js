import { Store } from 'flummox';
import keyBy from 'lodash/keyBy';

export default class EmployeeStore extends Store {
  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(
      employeesActions.getWaybillDrivers,
      this.handleGetWaybillDrivers,
    );

    this.state = {
      employeesList: [],
      employeesIndex: {},
      waybillDriversList: [],
    };
  }

  handleGetEmployees({ result }) {
    const data = result.map((empl) => ({
      ...empl,
      active: !!empl.active,
    }));

    this.setState({
      employeesList: data,
      employeesIndex: keyBy(data, 'id'),
    });
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }
}
