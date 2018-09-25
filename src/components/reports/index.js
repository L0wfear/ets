/**
 * @module components/reports
 * Отчеты
 */
import Analytics from 'components/reports/analytics/Analytics';
import CarDowntimeAndOvermileage from 'components/reports/operational/car_downtime_and_overmileage/report';
import BrigadeEfficiency from 'components/reports/operational/brigade_efficiency/report';
import CarUsageReportWithTrack from 'components/reports/operational/car_usage_report_with_track/report';
import carConditin from 'components/reports/operational/car-condition/report';
import CarMovementTimeReport from 'components/reports/operational/car-movement-time-report/report';
import CleaningStatusTechOp from 'components/reports/regulated/cleaning_status_tech_op/report';
import DailyCleaningCafap from 'components/reports/regulated/daily_cleaning_cafap/report';
import DailyCleaningEts from 'components/reports/regulated/daily_cleaning_ets/report';
import DtCoverageReport from 'components/reports/dt_coverage/DtCoverageReport';
import EmployeeEfficiency from 'components/reports/operational/employee_efficiency/report';
import FuelConsumption from 'components/reports/regulated/fuel_consumption/report';
import FuelConsumptionSummary from 'components/reports/regulated/fuel_consumption_summary/report';
import InquiryExpiringDate from 'components/reports/operational/inquiry_expiring_date/report';
import LongRepair from 'components/reports/operational/long_repair/report';
import Mission from 'components/reports/operational/mission/report';
import MissionProgress from 'components/reports/operational/mission_progress/report';
import OdhCoverageReport from 'components/reports/odh_coverage/OdhCoverageReport';
import RouteOdhCoverage from 'components/reports/operational/route_odh_coverage/report';
import TechMaintenanceSchedule from 'components/reports/operational/tech_maintenance_schedule/report';
import TrackEvents from 'components/reports/operational/track_events/Report';

export default {
  Analytics,
  BrigadeEfficiency,
  carConditin,
  CarDowntimeAndOvermileage,
  CarMovementTimeReport,
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
