import { getChildrenData } from 'utils/routes/getChildrenData';

// new
import cleaningRateList from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data';

// old
import odhNorm from 'components/directories/data_for_calculation/odh_norm/config-data';
import maintenanceWork from 'components/directories/data_for_calculation/maintenance_work/config-data';

// new
import fuelOperationsList from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data';

// old
import odhNormDataSummer from 'components/directories/data_for_calculation/odh_norm_data_summer/config-data';
import efficiency from 'components/directories/data_for_calculation/efficiency/config-data';

const children = {
  cleaningRateList,
  odhNorm,
  maintenanceWork,
  fuelOperationsList,
  odhNormDataSummer,
  efficiency,
};

export default {
  title: 'Показатели для расчета',
  children,
  ...getChildrenData(children),
};
