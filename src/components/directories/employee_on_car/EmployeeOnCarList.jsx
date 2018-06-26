import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import EmployeeOnCarTable from 'components/directories/employee_on_car/table/EmployeeOnCarTable';
import { customOptionsTableFromMainResult } from 'components/directories/employee_on_car/table/helpData';
import permissions from 'components/directories/employees/config-data/permissions';
import { makeOptions } from 'components/ui/input/makeOptions';
import * as queryString from 'query-string';

@connectToStores(['employees', 'objects', 'session'])
@exportable({ entity: 'employee_on_car' })
@staticProps({
  entity: 'employee_on_car',
  permissions,
  listName: 'employeeOnCarList',
  tableComponent: EmployeeOnCarTable,
  selectField: '_uniq_field',
  operations: ['LIST'],
})
export default class EmployeeOnCarList extends ElementsList {
  init() {
    this.context.flux.getActions('employees').getEmployeeOnCarList()
      .then(({ result }) => {
        const options = makeOptions({
          data: result,
          options: customOptionsTableFromMainResult,
        });

        this.setState({ ...options });
        return { result };
      });
  }

  onRowDoubleClick = ({ props: { data } }) => {
    const query = {
      asuods_id: data.asuods_id,
    };
    this.props.history.push(`/cars?${queryString.stringify(query)}`);
  }

  getAdditionalProps = () => {
    const {
      GOV_NUMBERS = [],
      GARAGE_NUMBERS = [],
      DRIVER_FIOS = [],
    } = this.state;
    return {
      GOV_NUMBERS,
      GARAGE_NUMBERS,
      DRIVER_FIOS,
    };
  }
}
