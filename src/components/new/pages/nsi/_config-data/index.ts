import { getChildrenData } from 'utils/routes/getChildrenData';

// import employees from 'components/old/directories/employees/config-data';
// import employeeOnCar from 'components/old/directories/employee_on_car/config-data';
// import order from 'components/old/directories/order/config-data';
// import technicalOperation from 'components/old/directories/technical_operation/config-data';
import companyList from 'components/new/pages/nsi/company/_config-data';
// import technicalOperationRelations from 'components/old/directories/technical_operation_relations/config-data';
import cars from 'components/new/pages/nsi/autobase/_config-data';
// import repairsRegistry from 'components/old/directories/repair/config-data';
// import normative from 'components/old/directories/normative/config-data';
import geoobjects from 'components/new/pages/nsi/geoobjects/_config-data';
import dataForCalculation from 'components/new/pages/nsi/data_for_calculation/_config-data';
// import medicalStats from 'components/old/directories/medical_stats/config-data';
// import companyStructure from 'components/old/directories/company_structure/config-data';
// import userActionLog from 'components/old/directories/user_action_log/config-data';

const children = {
//  employees,
//  employeeOnCar,
//  order,
//  technicalOperation,
  companyList,
//  technicalOperationRelations,
  dividerOne: { divider: true },
  cars,
//  repairsRegistry,
//  normative,
  geoobjects,
  dataForCalculation,
//  medicalStats,
  dividerTwo: { divider: true },
//  companyStructure,
//  userActionLog,
};

export default {
  title: 'НСИ new',
  children,
  ...getChildrenData(children),
};
