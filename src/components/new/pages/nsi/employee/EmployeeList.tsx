import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import EmployeeFormLazy from 'components/new/pages/nsi/employee/form';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/employee/_config-data/registry-config';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const EmployeeList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <EmployeeFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);
export default withRegistry<Employee, OwnProps>(config)(EmployeeList);
