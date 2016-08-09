/**
 * @module components/reports
 * Отчеты
 */
import analytics from './Analytics.jsx';
import coverage from './CoverageReport.jsx';
import fuelConsumption from './fuel_consumption/FuelReport.jsx';
import odh from './ODHReports.jsx';
import mission from './mission';
import route from './route';
import daily from './daily';
import weekly from './weekly';
import odhCoverageReport from './odh_coverage/OdhCoverageReport.jsx';
import carFuncTypeUsage from './car_func_type_usage';

export default {
  analytics,
  coverage,
  fuelConsumption,
  mission,
  odh,
  route,
  daily,
  weekly,
  odhCoverageReport,
  carFuncTypeUsage
}
