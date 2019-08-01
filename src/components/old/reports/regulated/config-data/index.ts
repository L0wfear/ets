import { getChildrenData } from 'utils/routes/getChildrenData';

import fuelConsumption from 'components/old/reports/regulated/fuel_consumption/config-data';
import fuelConsumptionSummary from 'components/old/reports/regulated/fuel_consumption_summary/config-data';
import dailyCleaningEts from 'components/old/reports/regulated/daily_cleaning_ets/config-data';
import dailyCleaningCafap from 'components/old/reports/regulated/daily_cleaning_cafap/config-data';
import cleaningStatusTechOp from 'components/old/reports/regulated/cleaning_status_tech_op/config-data';

const children = {
  fuelConsumption,
  fuelConsumptionSummary,
  dailyCleaningEts,
  dailyCleaningCafap,
  cleaningStatusTechOp,
};

export default {
  title: 'Регламентированные отчеты',
  children,
  ...getChildrenData(children),
};
