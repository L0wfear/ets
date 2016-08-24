import APIService from './APIService.js';

const USE_MOCKS = false;

export const RouteService   = new APIService('/route/', {});
export const RouteValidateService = new APIService('/route_validate/', {});
export const WaybillService = new APIService('/waybill/', {});
export const LatestWaybillDriverService = new APIService('/latest_waybill_driver/', {});
export const GeozoneService = new APIService('/geozone/', {});
export const DashboardService = new APIService('/dashboard/', {});
export const FaxogrammService = new APIService('/faxogramm/', {});
export const ModelsService = new APIService('/models/', {});
export const SpecialModelService = new APIService('/special_model/', {});
export const TypesService = new APIService('/types/', {});
export const EmployeeService = new APIService('/employee/', {});
export const DriverService = new APIService('/driver/', {});
export const FuelTypeService = new APIService('/fuel_type/', {});
export const FuelConsumptionRateService = new APIService('/fuel_consumption_rates/', {});
export const FuelOperationsService = new APIService('/fuel_operations/', {});
export const MissionService = new APIService('/mission/', {});
export const MissionReassignationService = new APIService('/mission_reassignation/', {});
export const MissionTemplateService = new APIService('/mission_template/', {});
export const MissionSourceService = new APIService('/mission_source/', {});
export const WorkKindsService = new APIService('/work_kind/', {});
export const TechnicalOperationService = new APIService('/technical_operation/', {});
export const CarService = new APIService('/car_actual/', {});
export const CarInfoService = new APIService('/car_additional_info/', {});
export const CustomersService = new APIService('/customers/', {});
export const MissionTemplatesForFaxogramm = new APIService('/get_mission_templates_for_faxogramm/', {});
export const DutyMissionService = new APIService('/duty_mission/', {});
export const DutyMissionTemplateService = new APIService('/duty_mission_template/', {});
export const MissionPrintService = new APIService('/plate_mission/', {});
export const DutyMissionPrintService = new APIService('/plate_duty_mission/', {});
export const AuthService = new APIService('/auth/', {});
export const AuthCheckService = new APIService('/auth/', {});
export const TechnicalOperationObjectsService = new APIService('/technical_operation_objects/', {});
export const TechnicalOperationTypesService = new APIService('/technical_operation_types/', {});
export const CompanyStructureService = new APIService('/company_structure/', {});
export const CompanyService = new APIService('/actual_companies/', {});
export const PositionService = new APIService('/position/', {});
export const VectorObjectService = new APIService('/vector_object/', {});
export const MissionDataService = new APIService('/mission_data/', {});
export const OrganizationsService = new APIService('/organizations/', { useMock: true });
export const ODHSupportStandardsService = new APIService('/odh_support_standards/', {useMock: true});
export const ODHSupportStandardsDataSummerService = new APIService('/odh_support_standards_data_summer/', {useMock: true});

/* Geoobjects - Геообъекты */
export const ODHService = new APIService('/odh/', {});
export const DTService = new APIService('/dt/', {});
export const FuelingWaterService = new APIService('/fueling_water/', {});
export const CarPoolService = new APIService('/carpool/', {});
export const DangerZoneService = new APIService('/danger_zone/', {});
export const GeozonesService = new APIService('/geozones/', {
  customPaths: true,
  customPathsList: ['odh', 'dt', 'ssp', 'carpool', 'fueling_water', 'danger_zone']
});

/* Reports - Отчеты */
export const MissionReportsService = new APIService('/car_odh_travel_report/', {});
export const RouteReportsService = new APIService('/route_odh_covering_report/', {});
export const WaybillJournalReportService = new APIService('/waybill_journal_report/', {});
export const WaybillsReportService = new APIService('/waybills_report/', {});
export const MissionLastReportService = new APIService('/mission_last_report/', {});
export const DailyCleaningReportsServiceETS = new APIService('/geozone_element_traveled_daily_report__ets/', {});
export const DailyCleaningReportsServiceCAFAP = new APIService('/geozone_element_traveled_daily_report__cafap/', {});
export const FuelReportService = new APIService('/fuel_consumption_report/', {});
export const AnalyticsService = new APIService('/analytical_reports/', {});
export const CarFuncTypeUsageReportService = new APIService('/car_func_type_usage_report/', {});
export const WeeklyTechnicalOperationCompleteReportsService = new APIService('/status_of_technical_operation_execution_weekly_report/', {});
export const CoverageReportService = new APIService('/current_coverage_report/', {});
export const OdhCoverageReportService = new APIService('/odh_coverage_report/', {});
