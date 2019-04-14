import { getChildrenData } from 'utils/routes/getChildrenData';

// old
import cleaningRate from 'components/directories/data_for_calculation/cleaning_rate/config-data';
import odhNorm from 'components/directories/data_for_calculation/odh_norm/config-data';
import maintenanceWork from 'components/directories/data_for_calculation/maintenance_work/config-data';

// new
import fuelOperationsList from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/_config-data';

// old
import odhNormDataSummer from 'components/directories/data_for_calculation/odh_norm_data_summer/config-data';
import efficiency from 'components/directories/data_for_calculation/efficiency/config-data';

const children = {
  cleaningRate,
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
