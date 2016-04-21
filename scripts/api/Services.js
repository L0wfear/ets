import APIService from './APIService.js';

let useMocks = false;

export const RouteService   = new APIService('/route/', useMocks);
export const RouteValidateService = new APIService('/route_validate/', useMocks);
export const RouteReportsService = new APIService('/route_odh_covering_report/', useMocks);
export const WaybillService = new APIService('/waybill/', useMocks);
export const GeozoneService = new APIService('/geozone/', useMocks);
export const DashboardService = new APIService('/dashboard/', useMocks);
export const FaxogrammService = new APIService('/faxogramm/', useMocks);
export const ModelsService = new APIService('/models/', useMocks);
export const SpecialModelService = new APIService('/special_model/', useMocks);
export const TypesService = new APIService('/types/', useMocks);
export const EmployeeService = new APIService('/employee/', useMocks);
export const DriverService = new APIService('/driver/', useMocks);
export const FuelTypeService = new APIService('/fuel_type/', useMocks);
export const FuelConsumptionRateService = new APIService('/fuel_consumption_rates/', useMocks);
export const FuelOperationsService = new APIService('/fuel_operations/', useMocks);
export const MissionService = new APIService('/mission/', useMocks);
export const MissionTemplateService = new APIService('/mission_template/', useMocks);
export const MissionSourceService = new APIService('/mission_source/', useMocks);
export const ODHService = new APIService('/odh/', useMocks);
export const DTService = new APIService('/dt/', useMocks);
export const WorkKindsService = new APIService('/work_kind/', useMocks);
export const TechnicalOperationService = new APIService('/technical_operation/', useMocks);
export const CarService = new APIService('/car_actual/', useMocks);
export const CarInfoService = new APIService('/car_additional_info/', useMocks);
export const CustomersService = new APIService('/customers/', useMocks);
export const MissionTemplatesForFaxogramm = new APIService('/get_mission_templates_for_faxogramm/', useMocks);
export const CarFuncTypeService = new APIService('/car_func_type/', useMocks);
export const DutyMissionService = new APIService('/duty_mission/', useMocks);
export const DutyMissionTemplateService = new APIService('/duty_mission_template/', useMocks);
export const MissionPrintService = new APIService('/plate_mission/', useMocks);
export const DutyMissionPrintService = new APIService('/plate_duty_mission/', useMocks);
export const AuthService = new APIService('/auth/', useMocks);
export const AuthCheckService = new APIService('/auth/', useMocks);
export const TechnicalOperationObjectsService = new APIService('/technical_operation_objects/', useMocks);
export const TechnicalOperationTypesService = new APIService('/technical_operation_types/', useMocks);
export const CompanyStructureService = new APIService('/company_structure/', useMocks);
export const DailyCleaningReportsService = new APIService('/geozone_element_traveled_daily_report/', useMocks);
export const WeeklyTechnicalOperationCompleteReportsService = new APIService('/status_of_technical_operation_execution_weekly_report/', useMocks);
export const PositionService = new APIService('/position/', useMocks);

// REPORTS

export const MissionReportsService = new APIService('/car_odh_travel_report/');
export const MissionLastReportService = new APIService('/mission_last_report/', useMocks);


// export const TRACK_URL                 = getOldUrl('/tracks/');
// export const POINTS_URL                = getUrl('/data');
// export const WEATHER_URL               = getUrl('/weather/');
// export const GEO_OBJECTS_URL           = getUrl('/geo_objects/');
// export const LOGIN_URL                 = getUrl('/auth/');
// export const AUTH_CHECK_URL            = getUrl('/auth_check');
// export const ODHS_URL                  = getUrl('/odh/');
// export const DTS_URL                   = getUrl('/dt/');
// export const MISSIONS_CREATION_URL     = getUrl('/create_missions_from_mission_templates/');
