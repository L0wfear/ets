import { Store } from 'flummox';
import keyBy from 'lodash/keyBy';

export default class EmployeeStore extends Store {
  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(employeesActions.getEmployees, this.handleGetEmployees);
    this.register(
      employeesActions.getEmployeeBindedToCar,
      this.handleGetEmployeeBindedToCar,
    );
    this.register(
      employeesActions.getWaybillDrivers,
      this.handleGetWaybillDrivers,
    );
    this.register(employeesActions.getDrivers, this.handleGetDrivers);

    this.state = {
      employeesList: [],
      employeesIndex: {},
      employeesBindedoOnCarList: [],
      uniqEmployeesBindedoOnCarList: [],
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

  handleGetEmployeeBindedToCar(result) {
    this.setState({
      employeesBindedoOnCarList: result,
      uniqEmployeesBindedoOnCarList: Object.values(
        result.reduce((newObj, partialEmployee) => {
          if (!newObj[partialEmployee.employee_id]) {
            newObj[partialEmployee.employee_id] = partialEmployee;
          } else if (partialEmployee.binding_type === 'primary') {
            newObj[partialEmployee.employee_id] = partialEmployee;
          }

          return newObj;
        }, {}),
      ),
    });
  }

  handleGetDrivers({ result }) {
    this.setState({ driversList: result });
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }
}
