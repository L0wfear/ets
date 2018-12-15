import { getChildrenData } from 'utils/routes/getChildrenData';

import cleaningRate from 'components/directories/data_for_calculation/cleaning_rate/config-data';
import odhNorm from 'components/directories/data_for_calculation/odh_norm/config-data';
import maintenanceWork from 'components/directories/data_for_calculation/maintenance_work/config-data';
import fuelOperations from 'components/directories/data_for_calculation/fuel_operations/config-data';
import odhNormDataSummer from 'components/directories/data_for_calculation/odh_norm_data_summer/config-data';
import efficiency from 'components/directories/data_for_calculation/efficiency/config-data';

const children = {
  cleaningRate,
  odhNorm,
  maintenanceWork,
  fuelOperations,
  odhNormDataSummer,
  efficiency,
};

export default {
  title: 'Показатели для расчета',
  children,
  ...getChildrenData(children),
};
