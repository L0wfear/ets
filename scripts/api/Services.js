import APIService from './APIService.js';
import * as urls from '../urls.js';

export const RouteService   = new APIService('/route/');
export const RouteValidateService = new APIService('/route_validate/');
export const RouteReportsService = new APIService('/route_odh_covering_report/');
export const WaybillService = new APIService('/waybill/');
export const GeozoneService = new APIService('/geozone/');
export const DashboardService = new APIService('/dashboard/');
export const FaxogrammService = new APIService('/faxogramm/');
export const ModelsService = new APIService('/models/');
export const TypesService = new APIService('/types/');
export const EmployeeService = new APIService('/employee/');
export const FuelTypeService = new APIService('/fuel_type/');
export const FuelConsumptionRateService = new APIService('/fuel_consumption_rates/');
export const FuelOperationsService = new APIService('/fuel_operations/');
export const MissionService = new APIService('/mission/');
export const MissionTemplateService = new APIService('/mission_template/');
export const MissionSourceService = new APIService('/mission_source/');
export const ODHService = new APIService('/odh/');
export const WorkKindsService = new APIService('/work_kind/');
export const TechnicalOperationService = new APIService('/technical_operation/');
export const CarService = new APIService('/car_actual/');
export const CarInfoService = new APIService('/car_additional_info/');
export const CustomersService = new APIService('/customers/');
export const MissionTemplatesForFaxogramm = new APIService('/get_mission_templates_for_faxogramm/');
export const MissionLastReportService = new APIService('/mission_last_report/');

// REPORTS

export const MissionReportsService = new APIService('/car_odh_travel_report/');



let getUrl = (d) => d;

//export const TRACK_URL                 = getOldUrl('/tracks/');
export const POINTS_URL                = getUrl('/data');
export const WEATHER_URL               = getUrl('/weather/');
export const GEO_OBJECTS_URL           = getUrl('/geo_objects/');
export const ROADS_ACTUAL_URL          = getUrl('/roads_actual/');
export const GET_ROAD_BY_ODH_URL       = getUrl('/road_info/');
export const LOGIN_URL                 = getUrl('/auth/');
export const AUTH_CHECK_URL            = getUrl('/auth_check');
export const ODHS_URL                  = getUrl('/odh/');
export const MISSIONS_CREATION_URL     = getUrl('/create_missions_from_mission_templates/');
