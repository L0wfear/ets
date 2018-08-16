import * as queryString from 'query-string';

import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import EmployeeFormWrap from 'components/directories/employees/EmployeeFormWrap.jsx';
import EmployeesTable from 'components/directories/employees/EmployeesTable.tsx';

import permissions from 'components/directories/employees/config-data/permissions';

@connectToStores(['employees', 'objects', 'session'])
@exportable({ entity: 'employee' })
@staticProps({
  entity: 'employee',
  permissions,
  listName: 'employeesList',
  tableComponent: EmployeesTable,
  formComponent: EmployeeFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
export default class EmployeesList extends ElementsList {
  constructor() {
    super();
    this.preventUrlFilters = true;
  }
  async componentDidMount() {
    super.componentDidMount();
    const linear = true;
    const descendants_by_user = true;

    const { flux } = this.context;
    flux.getActions('companyStructure').getCompanyStructure(linear, descendants_by_user);

    const [employees] = await Promise.all([
      flux.getActions('employees').getEmployees(),
      flux.getActions('objects').getCars(),
      flux.getActions('objects').getPositions(),
    ]);

    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (searchObject.employee_id) {
      const employee_id = parseInt(searchObject.employee_id, 10);
      const selectedElement = employees.result.find(employee => employee.id === employee_id);
      if (selectedElement) {
        // NOTE Так надо, потому что открыть форму можно только через стейт родительского класса
        this.setState({
          ...this.state,
          selectedElement,
          showForm: true,
        });
      } else {
        this.props.history.replaceState(null, this.props.location.pathname, {});
      }
    }
  }
}
