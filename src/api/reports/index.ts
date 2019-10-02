import ETS_API_FACTORY from 'api/EtsAPIServiceFactory';

export const MissionProgressReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'mission_progress_report',
  {},
);
export const BrigadeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter(
  'reports/efficiency/brigade',
  {},
);
export const EmployeeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter(
  'reports/efficiency/employee',
  {},
);

// временно
export const FuelReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_consumption_new_report',
);
export const FuelSummaryReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_consumption_summary_report',
  {},
);
export const DailyCleaningReportsServiceETS = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_status_report',
  {},
);
export const MissionReportsService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_travel_report',
  {},
);
export const CarConditionReport = ETS_API_FACTORY.createApiServiceAdapter(
  'car_condition_report',
  {},
);
export const CarDowntimeAndOvermileageReport = ETS_API_FACTORY.createApiServiceAdapter(
  'car_downtime_and_overmileage_report',
  {},
);
export const CleaningVolume = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_volume',
  {},
);

export const DailyCleaningReportsServiceCAFAP = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_status_cafap_report',
  {},
);
export const CleaningStatusTechOpReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_status_tech_op_report',
  {},
);
export const CarUsageReport = ETS_API_FACTORY.createApiServiceAdapter(
  'car_usage_report',
  {},
);
export const TrackEventsReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'track_events',
  {},
);
export const RouteODHCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'route_odh_coverage_report',
  {},
);

export const LongRepair = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/reports/long_repair',
  {},
);
export const TechMaintenanceSchedule = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/reports/tech_maintenance_schedule',
  {},
);

export const InquiryExpiringDate = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/reports/inquiry_expiring_date',
  {},
);

export const CarMovementTimeReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_movement_time_report',
);

export const CarsCountDeviation = ETS_API_FACTORY.createApiServiceAdapter(
  'cars_count_deviation',
  {},
);

export const CarsTravelTimeReportNew = ETS_API_FACTORY.createApiServiceAdapter(
  'cars_travel_time',
);

export const FuelCardsReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_cards_report',
);
