import ETS_API_FACTORY from './../EtsAPIServiceFactory';

export const MissionReportsService = ETS_API_FACTORY.createApiServiceAdapter('car_odh_travel_report', {});
export const RouteReportsService = ETS_API_FACTORY.createApiServiceAdapter('route_odh_covering_report', {});
export const WaybillJournalReportService = ETS_API_FACTORY.createApiServiceAdapter('waybill_journal_report', {});
export const WaybillsReportService = ETS_API_FACTORY.createApiServiceAdapter('waybills_report', {});
export const MissionLastReportService = ETS_API_FACTORY.createApiServiceAdapter('mission_last_report', {});
export const DailyCleaningReportsServiceETS = ETS_API_FACTORY.createApiServiceAdapter(
  'geozone_element_traveled_daily_report__ets', {},
);
export const DailyCleaningReportsServiceCAFAP = ETS_API_FACTORY.createApiServiceAdapter(
  'geozone_element_traveled_daily_report__cafap', {},
);
export const BrigadeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter('reports/efficiency/brigade', {});
export const FuelReportService = ETS_API_FACTORY.createApiServiceAdapter('fuel_consumption_report', {});
export const AnalyticsService = ETS_API_FACTORY.createApiServiceAdapter('analytical_reports', {});
export const CarFuncTypeUsageReportService = ETS_API_FACTORY.createApiServiceAdapter('car_usage_by_company', {});
export const CarFuncTypeUsageDetailReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_usage_by_func_type', {},
);
export const WeeklyTechnicalOperationCompleteReportsService = ETS_API_FACTORY.createApiServiceAdapter(
  'status_of_technical_operation_execution_weekly_report', {},
);
export const CoverageReportService = ETS_API_FACTORY.createApiServiceAdapter('current_coverage_report', {});
export const OdhCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter('odh_coverage_report', {});
export const DtCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter('dt_coverage_report', {});
export const BrigadeAndEmployeeEfficiencyReport1LService = ETS_API_FACTORY.createApiServiceAdapter(
  'efficiency_for_okrug_report', {},
);
export const BrigadeEfficiencyReport2LService = ETS_API_FACTORY.createApiServiceAdapter(
  'brigade_efficiency_report', {},
);
export const EmployeeEfficiencyReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'employee_efficiency_report', {},
);
export const TrackEventsReportService = ETS_API_FACTORY.createApiServiceAdapter('track_events', {});
