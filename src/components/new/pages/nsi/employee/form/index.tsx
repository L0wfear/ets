import * as React from 'react';

import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';

const EmployeeFrom = React.lazy(() => (
  import(/* webpackChunkName: "employee_form" */ 'components/new/pages/nsi/employee/form/EmployeeForm')
));

type OwnProps = WithFormRegistrySearchProps<Employee>;

export default withFormRegistrySearch<OwnProps, Employee>({
  add_path: 'employee',
})(EmployeeFrom);
