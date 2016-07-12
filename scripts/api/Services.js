import APIService from './APIService.js';

const USE_MOCKS = false;

export const RouteService   = new APIService('/route/', USE_MOCKS);
export const RouteValidateService = new APIService('/route_validate/', USE_MOCKS);
export const WaybillService = new APIService('/waybill/', USE_MOCKS);
export const LatestWaybillDriverService = new APIService('/latest_waybill_driver/', USE_MOCKS);
export const GeozoneService = new APIService('/geozone/', USE_MOCKS);
export const DashboardService = new APIService('/dashboard/', USE_MOCKS);
export const FaxogrammService = new APIService('/faxogramm/', USE_MOCKS);
export const ModelsService = new APIService('/models/', USE_MOCKS);
export const SpecialModelService = new APIService('/special_model/', USE_MOCKS);
export const TypesService = new APIService('/types/', USE_MOCKS);
export const EmployeeService = new APIService('/employee/', USE_MOCKS);
export const DriverService = new APIService('/driver/', USE_MOCKS);
export const FuelTypeService = new APIService('/fuel_type/', USE_MOCKS);
export const FuelConsumptionRateService = new APIService('/fuel_consumption_rates/', USE_MOCKS);
export const FuelOperationsService = new APIService('/fuel_operations/', USE_MOCKS);
export const MissionService = new APIService('/mission/', USE_MOCKS);
export const MissionReassignationService = new APIService('/mission_reassignation/', USE_MOCKS);
export const MissionTemplateService = new APIService('/mission_template/', USE_MOCKS);
export const MissionSourceService = new APIService('/mission_source/', USE_MOCKS);
export const ODHService = new APIService('/odh/', USE_MOCKS);
export const DTService = new APIService('/dt/', USE_MOCKS);
export const WorkKindsService = new APIService('/work_kind/', USE_MOCKS);
export const TechnicalOperationService = new APIService('/technical_operation/', USE_MOCKS);
export const CarService = new APIService('/car_actual/', USE_MOCKS);
export const CarInfoService = new APIService('/car_additional_info/', USE_MOCKS);
export const CustomersService = new APIService('/customers/', USE_MOCKS);
export const MissionTemplatesForFaxogramm = new APIService('/get_mission_templates_for_faxogramm/', USE_MOCKS);
export const DutyMissionService = new APIService('/duty_mission/', USE_MOCKS);
export const DutyMissionTemplateService = new APIService('/duty_mission_template/', USE_MOCKS);
export const MissionPrintService = new APIService('/plate_mission/', USE_MOCKS);
export const DutyMissionPrintService = new APIService('/plate_duty_mission/', USE_MOCKS);
export const AuthService = new APIService('/auth/', USE_MOCKS);
export const AuthCheckService = new APIService('/auth/', USE_MOCKS);
export const TechnicalOperationObjectsService = new APIService('/technical_operation_objects/', USE_MOCKS);
export const TechnicalOperationTypesService = new APIService('/technical_operation_types/', USE_MOCKS);
export const CompanyStructureService = new APIService('/company_structure/', USE_MOCKS);
export const CompanyService = new APIService('/actual_companies/', USE_MOCKS);
export const PositionService = new APIService('/position/', USE_MOCKS);
export const VectorObjectService = new APIService('/vector_object/', USE_MOCKS);

export const SSPService = new APIService('/ssp/', true);
export const PZVService = new APIService('/pzv/', true);
export const CarPoolService = new APIService('/carpool/', true);
export const DangerZoneService = new APIService('/danger_zone/', true);
export const MissionDataService = new APIService('/mission_data/', true);
export const OrganizationsService = new APIService('/organizations/', true);

// REPORTS

export const MissionReportsService = new APIService('/car_odh_travel_report/');
export const RouteReportsService = new APIService('/route_odh_covering_report/', USE_MOCKS);
export const WaybillJournalReportService = new APIService('/waybill_journal_report/', USE_MOCKS);
export const WaybillsReportService = new APIService('/waybills_report/', USE_MOCKS);
export const MissionLastReportService = new APIService('/mission_last_report/', USE_MOCKS);
export const DailyCleaningReportsServiceETS = new APIService('/geozone_element_traveled_daily_report__ets/', USE_MOCKS);
export const DailyCleaningReportsServiceCAFAP = new APIService('/geozone_element_traveled_daily_report__cafap/', USE_MOCKS);
export const FuelReportService = new APIService('/fuel_consumption_report/', USE_MOCKS);
export const AnalyticsService = new APIService('/analytical_reports/', USE_MOCKS);
export const WeeklyTechnicalOperationCompleteReportsService = new APIService('/status_of_technical_operation_execution_weekly_report/', USE_MOCKS);
export const CoverageReportService = new APIService('/current_coverage_report/', USE_MOCKS);
