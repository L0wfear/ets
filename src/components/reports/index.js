/**
 * @module components/reports
 * Отчеты
 */
import analytics from './Analytics.jsx';
import coverage from './CoverageReport.jsx';
import fuelConsumption from './fuel_consumption/report.ts';
import odhCoverageReport from './odh_coverage/OdhCoverageReport.jsx';
import dtCoverageReport from './dt_coverage/DtCoverageReport.jsx';
import odh from './ODHReports.jsx';
import * as mission from './mission';
import * as route from './route';
import * as daily from './daily';
import * as weekly from './weekly';
import * as carFuncTypeUsage from './car_func_type_usage';
import * as brigadeEfficiency from './brigade_efficiency';
import * as employeeEfficiency from './employee_efficiency';
import * as trackEvents from './track_events';

export {
  analytics,
  coverage,
  fuelConsumption,
  mission,
  odh,
  route,
  daily,
  weekly,
  odhCoverageReport,
  dtCoverageReport,
  carFuncTypeUsage,
  brigadeEfficiency,
  employeeEfficiency,
  trackEvents,
};
