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

    this.state = {
      employeesList: [],
      employeesIndex: {},
      employeesBindedoOCarList: [],
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
    });
  }

  handleGetEmployeeOnCarList({ result }) {
    this.setState({ employeeOnCarList: result.map((row, index) => ({ ...row, _uniq_field: index + 1 })) });
  }

  handleGetDrivers({ result }) {
    this.setState({ driversList: result });
  }

  handleGetForemans({ result }) {
    this.setState({ foremanList: result });
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }
}
