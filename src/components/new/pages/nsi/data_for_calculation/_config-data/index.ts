import { getChildrenData } from 'utils/routes/getChildrenData';

// new
import cleaningRateList from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data';
import consumableMaterialList from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data';
import maintenanceWorkList from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/_config-data';
import fuelOperationsList from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data';
import odhNormDataSummerList from 'components/new/pages/nsi/data_for_calculation/pages/odh_norm_data_summer/_config-data';
import efficiencyList from 'components/new/pages/nsi/data_for_calculation/pages/efficiency/_config-data';

const children = {
  cleaningRateList,
  consumableMaterialList,
  maintenanceWorkList,
  fuelOperationsList,
  odhNormDataSummerList,
  efficiencyList,
};

export default {
  title: 'Показатели для расчета',
  children,
  ...getChildrenData(children),
};
