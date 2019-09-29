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
    this.register(employeesActions.getDrivers, this.handleGetDrivers);

    this.state = {
      employeesList: [],
      employeesIndex: {},
      driversList: [],
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

  handleGetDrivers({ result }) {
    this.setState({ driversList: result });
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }
}
