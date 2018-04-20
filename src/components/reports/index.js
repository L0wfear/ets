/**
 * @module components/reports
 * Отчеты
 */
import analytics from './Analytics.jsx';
import coverage from './CoverageReport.jsx';
import fuelConsumption from './fuel_consumption/report.tsx';
import fuelConsumptionSummary from './fuel_consumption_summary/report.tsx';
import odhCoverageReport from './odh_coverage/OdhCoverageReport.jsx';
import dtCoverageReport from './dt_coverage/DtCoverageReport.jsx';
import odh from './ODHReports.jsx';
import mission from './mission/report.ts';
import missionProgress from './mission_progress/report.ts';
import routeOdhCoverage from './route_odh_coverage/report';
import * as daily from './daily';
import cleaningStatusTechOp from './cleaning_status_tech_op/report.tsx';
import carUsage from './car_usage/report';
import brigadeEfficiency from './brigade_efficiency/report.tsx';
import employeeEfficiency from './employee_efficiency/report.ts';
import trackEvents from './track_events/Report';
import longRepair from './long_repair/report.tsx';
import techMaintenanceSchedule from './tech_maintenance_schedule/report';
import inquiryExpiringDate from './inquiry_expiring_date/report'

export {
  analytics,
  coverage,
  fuelConsumption,
  fuelConsumptionSummary,
  mission,
  missionProgress,
  odh,
  routeOdhCoverage,
  daily,
  cleaningStatusTechOp,
  odhCoverageReport,
  dtCoverageReport,
  carUsage,
  brigadeEfficiency,
  employeeEfficiency,
  trackEvents,
  longRepair,
  techMaintenanceSchedule,
  inquiryExpiringDate,
};
