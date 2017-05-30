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
import mission from './mission/report.ts';
import * as route from './route';
import * as daily from './daily';
import cleaningStatusTechOp from './cleaning_status_tech_op/report.tsx';
import * as carFuncTypeUsage from './car_func_type_usage';
import brigadeEfficiency from './brigade_efficiency/report.tsx';
import employeeEfficiency from './employee_efficiency/report.ts';
import * as trackEvents from './track_events';

export {
  analytics,
  coverage,
  fuelConsumption,
  mission,
  odh,
  route,
  daily,
  cleaningStatusTechOp,
  odhCoverageReport,
  dtCoverageReport,
  carFuncTypeUsage,
  brigadeEfficiency,
  employeeEfficiency,
  trackEvents,
};
