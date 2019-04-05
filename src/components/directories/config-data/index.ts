import { getChildrenData } from 'utils/routes/getChildrenData';

import employeeOnCar from 'components/directories/employee_on_car/config-data';
import order from 'components/directories/order/config-data';
import companyList from 'components/new/pages/nsi/company/_config-data';
import technicalOperationRelations from 'components/directories/technical_operation_relations/config-data';
import autobasePages from 'components/new/pages/nsi/autobase/_config-data';
import repairsRegistry from 'components/directories/repair/config-data';
import normative from 'components/directories/normative/config-data';
import geoobjects from 'components/new/pages/nsi/geoobjects/_config-data';
import dataForCalculation from 'components/directories/data_for_calculation/config-data';
import medicalStats from 'components/directories/medical_stats/config-data';
import companyStructure from 'components/directories/company_structure/config-data';
import userActionLog from 'components/directories/user_action_log/config-data';

import employeesList from 'components/new/pages/nsi/employee/_config-data';
import normRegistryList from 'components/new/pages/nsi/norm_registry/_config-data';

const children = {
  employeesList,
  employeeOnCar,
  order,
  normRegistryList,
  companyList,
  technicalOperationRelations,
  dividerOne: { divider: true },
  autobasePages,
  repairsRegistry,
  normative,
  geoobjects,
  dataForCalculation,
  medicalStats,
  dividerTwo: { divider: true },
  companyStructure,
  userActionLog,
};

export default {
  title: 'НСИ',
  children,
  ...getChildrenData(children),
};
