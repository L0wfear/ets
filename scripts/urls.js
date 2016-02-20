import config from './config.js';

export const getUrl = (url) => config.backend ? config.backend + url : url;
let getOldUrl = (url) => config.backendOld ? config.backendOld + url : url;


export const TRACK_URL                 = getOldUrl('/tracks/');
export const POINTS_URL                = getUrl('/data');
export const WEATHER_URL               = getUrl('/weather/');
export const GEO_OBJECTS_URL           = getUrl('/geo_objects/');
export const ROADS_ACTUAL_URL          = getUrl('/roads_actual/');
export const GET_ROAD_BY_ODH_URL       = getUrl('/road_info/');
export const CARS_INFO_URL             = getUrl('/cars_info/');
export const FUEL_OPERATIONS_URL       = getUrl('/fuel_operations/');
export const FUEL_CONSUMPTION_RATE_URL = getUrl('/fuel_consumption_rates/');
export const LOGIN_URL                 = getUrl('/auth/');
export const AUTH_CHECK_URL            = getUrl('/auth_check');
export const CARS_ACTUAL_URL           = getUrl('/car_actual/');
export const CARS_ADDITIONAL_INFO_URL  = getUrl('/car_additional_info/');
export const EMPLOYEE_URL              = getUrl('/employee/');
export const FUEL_TYPES_URL            = getUrl('/fuel_type/');
export const TECH_OPERATIONS_URL       = getUrl('/technical_operation/');
export const ODHS_URL                  = getUrl('/odh/');
export const WORK_KINDS_URL            = getUrl('/work_kind/');
export const MISSIONS_URL              = getUrl('/mission/');
export const MISSIONS_CREATION_URL     = getUrl('/create_missions_from_mission_templates/');
export const MISSION_SOURCES_URL       = getUrl('/mission_source/');
export const MISSION_TEMPLATES_URL     = getUrl('/mission_template/');
export const ROUTE_REPORTS_URL         = getUrl('/route_odh_covering_report/');
export const ROUTE_VALIDATE_URL        = getUrl('/route_validate/');
export const MISSION_REPORTS_URL       = getUrl('/car_odh_travel_report/');
export const GEOZONE_URL               = getUrl('/geozone/');
export const DASHBOARD_URL             = getUrl('/dashboard/');
export const FAXOGRAMMS_URL            = getUrl('/faxogramm/');
export const CUSTOMERS_URL             = getUrl('/customers/');


export const WAYBILL_URL               = getUrl('/waybill/');
export const ROUTE_URL                 = getUrl('/route/');
