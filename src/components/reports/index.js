/**
 * @module components/reports
 * Отчеты
 */
import Analytics from 'components/reports/analytics/Analytics.jsx';
import BrigadeEfficiency from 'components/reports/operational/brigade_efficiency/report.tsx';
import CarUsageReportWithTrack from 'components/reports/operational/car_usage_report_with_track/report';
import carConditin from 'components/reports/operational/car-condition/report';
import CleaningStatusTechOp from 'components/reports/regulated/cleaning_status_tech_op/report.tsx';
import DailyCleaningCafap from 'components/reports/regulated/daily_cleaning_cafap/report';
import DailyCleaningEts from 'components/reports/regulated/daily_cleaning_ets/report';
import DtCoverageReport from 'components/reports/dt_coverage/DtCoverageReport.jsx';
import EmployeeEfficiency from 'components/reports/operational/employee_efficiency/report.ts';
import FuelConsumption from 'components/reports/regulated/fuel_consumption/report.ts';
import FuelConsumptionSummary from 'components/reports/regulated/fuel_consumption_summary/report.ts';
import InquiryExpiringDate from 'components/reports/operational/inquiry_expiring_date/report';
import LongRepair from 'components/reports/operational/long_repair/report.tsx';
import Mission from 'components/reports/operational/mission/report.ts';
import MissionProgress from 'components/reports/operational/mission_progress/report.ts';
import OdhCoverageReport from 'components/reports/odh_coverage/OdhCoverageReport.jsx';
import RouteOdhCoverage from 'components/reports/operational/route_odh_coverage/report';
import TechMaintenanceSchedule from 'components/reports/operational/tech_maintenance_schedule/report';
import TrackEvents from 'components/reports/operational/track_events/Report';

export default {
  Analytics,
  BrigadeEfficiency,
  carConditin,
  CarUsageReportWithTrack,
  CleaningStatusTechOp,
  DailyCleaningCafap,
  DailyCleaningEts,
  DtCoverageReport,
  EmployeeEfficiency,
  FuelConsumption,
  FuelConsumptionSummary,
  InquiryExpiringDate,
  LongRepair,
  Mission,
  MissionProgress,
  OdhCoverageReport,
  RouteOdhCoverage,
  TechMaintenanceSchedule,
  TrackEvents,
};
