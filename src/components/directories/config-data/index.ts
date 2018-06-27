import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import employees from 'components/directories/employees/config-data';
import employeeOnCar from 'components/directories/employee_on_car/config-data';
import order from 'components/directories/order/config-data';
import technicalOperation from 'components/directories/technical_operation/config-data';
import technicalOperationRelations from 'components/directories/technical_operation_relations/config-data';
import transportation from 'components/directories/autobase/config-data';
import repairsRegistry from 'components/directories/repair/config-data';
import normative from 'components/directories/normative/config-data';
import geoobjects from 'components/directories/geoobjects/config-data';
import dataForCalculation from 'components/directories/data_for_calculation/config-data';
import medicalStats from 'components/directories/medical_stats/config-data';
import userActionLog from 'components/directories/user_action_log/config-data';

const children = {
  employees,
  employeeOnCar,
  order,
  technicalOperation,
  technicalOperationRelations,
  dividerOne: { divider: true },
  transportation,
  repairsRegistry,
  normative,
  geoobjects,
  dataForCalculation,
  medicalStats,
  dividerTwo: { divider: true },
  userActionLog,
};

export default {
  title: 'НСИ',
  children,
  permissions: getChildrenPermissions(children),
};
