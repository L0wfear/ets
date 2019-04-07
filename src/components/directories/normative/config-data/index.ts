import { getChildrenData } from 'utils/routes/getChildrenData';

import materialConsumptionRateList from 'components/new/pages/nsi/regulatory_indicator/pages/material_consumption_rate/_config-data/';
import fuelConsumptionRateList from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/_config-data/';
// old
import maintenanceRate from 'components/directories/normative/maintenance_rate/config-data';

const children = {
  materialConsumptionRateList,
  fuelConsumptionRateList,
  maintenanceRate,
};

export default {
  title: 'Нормативные показатели',
  children,
  ...getChildrenData(children),
};
