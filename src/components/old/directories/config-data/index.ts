import { getChildrenData } from 'utils/routes/getChildrenData';

import employeeOnCarList from 'components/new/pages/nsi/employee_on_car/_config-data';
import orderList from 'components/new/pages/nsi/order/_config-data';
import companyList from 'components/new/pages/nsi/company/_config-data';
import technicalOperationRelationsList from 'components/new/pages/nsi/technical_operation_relations/_config-data';
import autobasePages from 'components/new/pages/nsi/autobase/_config-data';
import repairsRegistryList from 'components/new/pages/nsi/repair/_config-data';
import regulatoryIndicator from 'components/new/pages/nsi/regulatory_indicator/_config-data';
import geoobjects from 'components/new/pages/nsi/geoobjects/_config-data';
import medicalStatsList from 'components/new/pages/nsi/medical_stats/_config-data';
import companyStructureList from 'components/new/pages/nsi/company_structure/_config-data';
import userActionLogList from 'components/new/pages/nsi/user_action_log/_config-data';
import employeesList from 'components/new/pages/nsi/employee/_config-data';
import normRegistryList from 'components/new/pages/nsi/norm_registry/_config-data';
import dataForCalculation from 'components/new/pages/nsi/data_for_calculation/_config-data';

const children = {
  employeesList,
  employeeOnCarList,
  orderList,
  normRegistryList,
  companyList,
  technicalOperationRelationsList,
  dividerOne: { divider: true },
  autobasePages,
  repairsRegistryList,
  regulatoryIndicator,
  geoobjects,
  dataForCalculation,
  medicalStatsList,
  dividerTwo: { divider: true },
  companyStructureList,
  userActionLogList,
};

export default {
  title: 'НСИ',
  children,
  ...getChildrenData(children),
};
