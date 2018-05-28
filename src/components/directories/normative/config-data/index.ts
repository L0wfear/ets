import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import materialConsumptionRate from 'components/directories/normative/material_consumption_rate/config-data';
import fuelRates from 'components/directories/normative/fuel_rates/config-data';
import maintenanceRate from 'components/directories/normative/maintenance_rate/config-data';

const children = {
  materialConsumptionRate,
  fuelRates,
  maintenanceRate,
};

export default {
  title: 'Нормативные показатели',
  children,
  permissions: getChildrenPermissions(children),
};
