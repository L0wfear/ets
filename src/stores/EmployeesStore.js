import { Store } from 'flummox';

export default class EmployeeStore extends Store {
  constructor(flux) {
    super();

    const employeesActions = flux.getActions('employees');
    this.register(
      employeesActions.getWaybillDrivers,
      this.handleGetWaybillDrivers,
    );

    this.state = {
      waybillDriversList: [],
    };
  }

  handleGetWaybillDrivers({ result }) {
    this.setState({ waybillDriversList: result.rows });
  }
}
