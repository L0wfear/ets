import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import CarActualFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/employee_on_car/_config-data/registry-config';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { EmployeeOnCar } from 'redux-main/reducers/modules/employee_on_car/@types/employeeOnCar';

type OwnProps = {};
const EmployeeOnCarList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <CarActualFormLazy registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<EmployeeOnCar, OwnProps>(getToConfig())(EmployeeOnCarList);
