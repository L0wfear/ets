import { getChildrenData } from 'utils/routes/getChildrenData';

import fuelConsumptionRateList from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/_config-data/';

const children = {
  fuelConsumptionRateList,
};

export default {
  title: 'Нормативные показатели',
  children,
  ...getChildrenData(children),
};
