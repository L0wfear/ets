import ETS_API_FACTORY from './../EtsAPIServiceFactory';

export const MissionProgressReportService = ETS_API_FACTORY.createApiServiceAdapter('mission_progress_report', {});
export const BrigadeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter('reports/efficiency/brigade', {});
export const EmployeeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter('reports/efficiency/employee', {});
export const FuelReportService = ETS_API_FACTORY.createApiServiceAdapter('fuel_consumption_report', {});
export const FuelSummaryReportService = ETS_API_FACTORY.createApiServiceAdapter('fuel_consumption_summary_report', {});
export const DailyCleaningReportsServiceETS = ETS_API_FACTORY.createApiServiceAdapter('cleaning_status_report', {});
export const MissionReportsService = ETS_API_FACTORY.createApiServiceAdapter('car_travel_report', {});
export const DailyCleaningReportsServiceCAFAP = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_status_cafap_report', {},
);
export const CleaningStatusTechOpReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_status_tech_op_report', {},
);
export const CarUsageReportService = ETS_API_FACTORY.createApiServiceAdapter('car_usage_report', {});
export const TrackEventsReportService = ETS_API_FACTORY.createApiServiceAdapter('track_events', {});
export const RouteODHCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter('route_odh_coverage_report', {});
