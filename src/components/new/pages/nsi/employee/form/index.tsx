import * as React from 'react';

import { withFormRegistrySearchNew, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';

const EmployeeFrom = React.lazy(() => (
  import(/* webpackChunkName: "employee_form" */ 'components/new/pages/nsi/employee/form/EmployeeForm')
));

type OwnProps = WithFormRegistrySearchProps<Employee>;

export default withFormRegistrySearchNew<OwnProps, Employee>({
  add_path: 'employee',
})(EmployeeFrom);
