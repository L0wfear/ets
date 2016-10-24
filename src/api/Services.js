import ApiServiceFactory from './ApiServiceFactory.js';
import config from '../config.js';

const CITY_DASHBOARD_API_FACTORY = new ApiServiceFactory({
  apiUrl: 'http://ods.mos.ru/ssd/city-dashboard',
});

export const TrackDistanceService = CITY_DASHBOARD_API_FACTORY.createApiServiceAdapter('get_length');
export const TrackService = CITY_DASHBOARD_API_FACTORY.createApiServiceAdapter('tracks');

const ETS_API_FACTORY = new ApiServiceFactory({
  apiUrl: config.backend,
  headers: () => {
    const token = JSON.parse(window.localStorage.getItem('ets-session'));
    return {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
      'Access-Control-Expose-Headers': 'Content-Disposition',
    };
  },
});

export const RootService = ETS_API_FACTORY.createApiServiceAdapter('', {});
export const ConfigService = ETS_API_FACTORY.createApiServiceAdapter('config', {});

// TODO разбить на отдельные файлы

/* Путевые листы */
export const WaybillService = ETS_API_FACTORY.createApiServiceAdapter('waybill', {});
export const LatestWaybillDriverService = ETS_API_FACTORY.createApiServiceAdapter('latest_waybill_driver', {});

/* ТС */
export const CarService = ETS_API_FACTORY.createApiServiceAdapter('car_actual', {});
export const CarImageService = ETS_API_FACTORY.createApiServiceAdapter('car_image', {});
export const CarInfoService = ETS_API_FACTORY.createApiServiceAdapter('car_additional_info', {});

/* Рабочий стол */
export const DashboardService = ETS_API_FACTORY.createApiServiceAdapter('dashboard');

export const RouteService = ETS_API_FACTORY.createApiServiceAdapter('route', {});
export const RouteValidateService = ETS_API_FACTORY.createApiServiceAdapter('route_validate', {});
export const OwnersService = ETS_API_FACTORY.createApiServiceAdapter('owners');
export const GeozoneService = ETS_API_FACTORY.createApiServiceAdapter('geozone', {});
export const FaxogrammService = ETS_API_FACTORY.createApiServiceAdapter('faxogramm', {});
export const ModelsService = ETS_API_FACTORY.createApiServiceAdapter('models', {});
export const SpecialModelService = ETS_API_FACTORY.createApiServiceAdapter('special_model', {});
export const TypesService = ETS_API_FACTORY.createApiServiceAdapter('types', {});
export const EmployeeService = ETS_API_FACTORY.createApiServiceAdapter('employee', {});
export const DriverService = ETS_API_FACTORY.createApiServiceAdapter('driver', {});
export const FuelTypeService = ETS_API_FACTORY.createApiServiceAdapter('fuel_type', {});
export const FuelConsumptionRateService = ETS_API_FACTORY.createApiServiceAdapter('fuel_consumption_rates', {});
export const FuelOperationsService = ETS_API_FACTORY.createApiServiceAdapter('fuel_operations', {});
export const MissionService = ETS_API_FACTORY.createApiServiceAdapter('mission', {});
export const MissionReassignationService = ETS_API_FACTORY.createApiServiceAdapter('mission_reassignation', {});
export const MissionTemplateService = ETS_API_FACTORY.createApiServiceAdapter('mission_template', {});
export const MissionSourceService = ETS_API_FACTORY.createApiServiceAdapter('mission_source', {});
export const WorkKindsService = ETS_API_FACTORY.createApiServiceAdapter('work_kind', {});
export const TechnicalOperationService = ETS_API_FACTORY.createApiServiceAdapter('technical_operation', {});
export const CustomersService = ETS_API_FACTORY.createApiServiceAdapter('customers', {});
export const MissionTemplatesForFaxogramm = ETS_API_FACTORY.createApiServiceAdapter('get_mission_templates_for_faxogramm', {});
export const DutyMissionService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission', {});
export const DutyMissionTemplateService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission_template', {});
export const MissionPrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_mission', {});
export const DutyMissionPrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_duty_mission', {});
export const AuthService = ETS_API_FACTORY.createApiServiceAdapter('auth', {});
export const AuthCheckService = ETS_API_FACTORY.createApiServiceAdapter('auth_check', {});
export const TechnicalOperationObjectsService = ETS_API_FACTORY.createApiServiceAdapter('technical_operation_objects', {});
export const TechnicalOperationTypesService = ETS_API_FACTORY.createApiServiceAdapter('technical_operation_types', {});
export const CompanyStructureService = ETS_API_FACTORY.createApiServiceAdapter('company_structure', {});
export const CompanyService = ETS_API_FACTORY.createApiServiceAdapter('actual_companies', {});
export const PositionService = ETS_API_FACTORY.createApiServiceAdapter('position', {});
export const VectorObjectService = ETS_API_FACTORY.createApiServiceAdapter('vector_object', {});
export const MissionDataService = ETS_API_FACTORY.createApiServiceAdapter('mission_data', {});
export const OrganizationsService = ETS_API_FACTORY.createApiServiceAdapter('organizations', { useMock: true });
export const ODHNormService = ETS_API_FACTORY.createApiServiceAdapter('consumable_material', {}); //odh_norm
export const MeasureUnitService = ETS_API_FACTORY.createApiServiceAdapter('measure_unit', {});
export const ODHNormDataSummerService = ETS_API_FACTORY.createApiServiceAdapter('odh_norm_data_summer', { useMock: true });
export const EfficiencyService = ETS_API_FACTORY.createApiServiceAdapter('efficiency', { useMock: true });

/* Geoobjects - Геообъекты */
export const ODHService = ETS_API_FACTORY.createApiServiceAdapter('odh', {});
export const DTService = ETS_API_FACTORY.createApiServiceAdapter('dt', {});
export const FuelingWaterService = ETS_API_FACTORY.createApiServiceAdapter('fueling_water', {});
export const CarPoolService = ETS_API_FACTORY.createApiServiceAdapter('carpool', {});
export const DangerZoneService = ETS_API_FACTORY.createApiServiceAdapter('danger_zone', {});
export const GeozonesService = ETS_API_FACTORY.createApiServiceAdapter('geozones', {});

/* Reports - Отчеты */
export const MissionReportsService = ETS_API_FACTORY.createApiServiceAdapter('car_odh_travel_report', {});
export const RouteReportsService = ETS_API_FACTORY.createApiServiceAdapter('route_odh_covering_report', {});
export const WaybillJournalReportService = ETS_API_FACTORY.createApiServiceAdapter('waybill_journal_report', {});
export const WaybillsReportService = ETS_API_FACTORY.createApiServiceAdapter('waybills_report', {});
export const MissionLastReportService = ETS_API_FACTORY.createApiServiceAdapter('mission_last_report', {});
export const DailyCleaningReportsServiceETS = ETS_API_FACTORY.createApiServiceAdapter('geozone_element_traveled_daily_report__ets', {});
export const DailyCleaningReportsServiceCAFAP = ETS_API_FACTORY.createApiServiceAdapter('geozone_element_traveled_daily_report__cafap', {});
export const FuelReportService = ETS_API_FACTORY.createApiServiceAdapter('fuel_consumption_report', {});
export const AnalyticsService = ETS_API_FACTORY.createApiServiceAdapter('analytical_reports', {});
export const CarFuncTypeUsageReportService = ETS_API_FACTORY.createApiServiceAdapter('car_func_type_usage_report', {});
export const WeeklyTechnicalOperationCompleteReportsService = ETS_API_FACTORY.createApiServiceAdapter('status_of_technical_operation_execution_weekly_report', {});
export const CoverageReportService = ETS_API_FACTORY.createApiServiceAdapter('current_coverage_report', {});
export const OdhCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter('odh_coverage_report', {});

// async function a() {
//   const respo = await MissionDataService.path(60446).get();
//   console.info(respo);
// }
//
// a();
