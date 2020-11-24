import config from 'config';
import ApiServiceFactory from './ApiServiceFactory';
import ETS_API_FACTORY from './EtsAPIServiceFactory';

import * as reports from './reports';
import ETS_API_FACTORY_ETS_TEST from './EtsAPIServiceFactory_temp';

const CITY_DASHBOARD_API_FACTORY = new ApiServiceFactory({
  apiUrl: config.tracksCaching,
});

export const TrackInfoService = CITY_DASHBOARD_API_FACTORY.createApiServiceAdapter(
  'info',
); // в payload нужно прокидывать version из localStorage
export const TrackService = CITY_DASHBOARD_API_FACTORY.createApiServiceAdapter(
  'tracks',
); // в payload нужно прокидывать version из localStorage
export const ConfigTrackService = CITY_DASHBOARD_API_FACTORY.createApiServiceAdapter(
  'config',
);

export const RootService = ETS_API_FACTORY.createApiServiceAdapter('');
export const ConfigService = ETS_API_FACTORY.createApiServiceAdapter('config');
export const FilesService = ETS_API_FACTORY.createApiServiceAdapter('files');

// TODO разбить на отдельные файлы

/* Путевые листы */
export const WaybillService = ETS_API_FACTORY.createApiServiceAdapter(
  'waybill',
);
export const WaybillClosedService = ETS_API_FACTORY.createApiServiceAdapter(
  'waybill/closed',
);
export const WaybillAvailableMissionsService = ETS_API_FACTORY.createApiServiceAdapter(
  'waybill/available_missions',
);

export const WaybillCarService = ETS_API_FACTORY.createApiServiceAdapter(
  'filters/waybill/cars',
);
export const MissionCarService = ETS_API_FACTORY.createApiServiceAdapter(
  'filters/mission/cars',
);
export const MissionArchiveCarService = ETS_API_FACTORY.createApiServiceAdapter(
  'filters/mission_archive/cars',
);
export const LatestWaybillDriverService = ETS_API_FACTORY.createApiServiceAdapter(
  'latest_waybill_driver',
);
export const ReasonListService = ETS_API_FACTORY.createApiServiceAdapter(
  'rate_change_reason',
);

/* ТС */
export const CarActualService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_actual',
);
export const CarInfoService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_info',
);
export const CarService = ETS_API_FACTORY.createApiServiceAdapter('car');
export const FuelCardsService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_cards',
);
export const FuelCardsArchiveService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_cards_archive',
);

export const PenaltiesService = ETS_API_FACTORY.createApiServiceAdapter('penalties');
export const CarExcludeService = ETS_API_FACTORY.createApiServiceAdapter('car/exclude_filter');

/* Рабочий стол */
export const OwnersService = ETS_API_FACTORY.createApiServiceAdapter('owners');
export const DriverService = ETS_API_FACTORY.createApiServiceAdapter('driver');
export const EmployeeService = ETS_API_FACTORY.createApiServiceAdapter(
  'employee',
);
export const LayoffReasonService = ETS_API_FACTORY.createApiServiceAdapter(
  'layoff_reason',
);
export const EmployeeBindedToCarService = ETS_API_FACTORY.createApiServiceAdapter(
  'employee_binded_to_car',
);
export const EmployeeOnCarService = ETS_API_FACTORY.createApiServiceAdapter(
  'employee_on_car',
);

export const ForemanService = ETS_API_FACTORY.createApiServiceAdapter(
  'foreman/',
);
export const LastBrigadeService = ETS_API_FACTORY.createApiServiceAdapter(
  'last_brigade/',
);

export const DashboardService = ETS_API_FACTORY.createApiServiceAdapter(
  'dashboard',
);
export const RouteService = ETS_API_FACTORY.createApiServiceAdapter('route');
export const RouteValidateService = ETS_API_FACTORY.createApiServiceAdapter(
  'route_validate',
);
export const GeozoneService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozone',
);
export const OrderService = ETS_API_FACTORY.createApiServiceAdapter('order');
export const ModelsService = ETS_API_FACTORY.createApiServiceAdapter('models');
export const SpecialModelService = ETS_API_FACTORY.createApiServiceAdapter(
  'special_model',
);
export const TypesService = ETS_API_FACTORY.createApiServiceAdapter('types');
export const TypesAttrService = ETS_API_FACTORY.createApiServiceAdapter(
  'types_attr',
);

export const WaybillDriverService = ETS_API_FACTORY.createApiServiceAdapter(
  'medical_stats/allowed_drivers',
);
export const FuelTypeService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_type',
); // сервис отключен, типы тут getSessionState(state).appConfig.enums.FUEL_TYPE
export const FuelConsumptionRateService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_consumption_rates',
);
export const FuelOperationsService = ETS_API_FACTORY.createApiServiceAdapter(
  'fuel_operations',
);
export const WorkKindService = ETS_API_FACTORY.createApiServiceAdapter(
  'work_kind',
);
export const TechnicalOperationRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'technical_operation_registry',
);
export const AuthService = ETS_API_FACTORY.createApiServiceAdapter('auth');
export const AuthServiceEtsTest = ETS_API_FACTORY_ETS_TEST.createApiServiceAdapter(
  'auth',
);
export const AuthCheckService = ETS_API_FACTORY.createApiServiceAdapter(
  'auth_check',
);
export const AuthCheckServiceEtsTest = ETS_API_FACTORY_ETS_TEST.createApiServiceAdapter(
  'auth_check',
);

export const TechnicalOperationObjectsService = ETS_API_FACTORY.createApiServiceAdapter(
  'technical_operation_objects',
);
export const TechnicalOperationRelationsService = ETS_API_FACTORY.createApiServiceAdapter(
  'technical_operation_relations',
);
export const TechnicalOperationTypesService = ETS_API_FACTORY.createApiServiceAdapter(
  'technical_operation_types',
);
export const CompanyStructureService = ETS_API_FACTORY.createApiServiceAdapter(
  'company_structure',
);
export const CompanyService = ETS_API_FACTORY.createApiServiceAdapter(
  'companies',
);
export const PositionService = ETS_API_FACTORY.createApiServiceAdapter(
  'position',
);
export const VectorObjectService = ETS_API_FACTORY.createApiServiceAdapter(
  'vector_object',
);
export const ConsumableMaterialService = ETS_API_FACTORY.createApiServiceAdapter(
  'consumable_material',
);

export const ConsumableMaterialCountMissionService = ETS_API_FACTORY.createApiServiceAdapter(
  'consumable_material_count',
);
export const MeasureUnitService = ETS_API_FACTORY.createApiServiceAdapter(
  'measure_unit',
);
export const CleanCategoriesService = ETS_API_FACTORY.createApiServiceAdapter(
  'clean_categories',
);
export const MaintenanceWorkService = ETS_API_FACTORY.createApiServiceAdapter(
  'maintenance_work',
);
export const MaintenanceRateService = ETS_API_FACTORY.createApiServiceAdapter(
  'maintenance_rate',
);
export const CleaningRateService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_rate',
);

export const CleaningRatePropertieService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_rate/properties',
);

export const UserActionLogService = ETS_API_FACTORY.createApiServiceAdapter(
  'user_action_log',
);

/* Geoobjects - Геообъекты */
export const GeozonesService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones',
);

export const GeozoneDtService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/dt',
);
export const DTService = ETS_API_FACTORY.createApiServiceAdapter('dt');
export const GeozoneOdhService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/odh',
);
export const ODHService = ETS_API_FACTORY.createApiServiceAdapter('odh');
export const GeozoneSspService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/ssp',
);
export const GeozoneMspService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/msp',
);
export const GeozoneFuelingWaterService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/fueling_water',
);
export const GeozoneCarpoolService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/carpool',
);
export const GeozoneDangerZoneService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/danger_zone',
);
export const GeozonePgmStoreService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/pgm_store',
);
export const GeozoneSnowStorageService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozones/snow_storage',
);

export const GormostService = ETS_API_FACTORY.createApiServiceAdapter(
  'gormost',
);
export const GeozoneFountainsService = ETS_API_FACTORY.createApiServiceAdapter(
  'gormost/fountains',
);
export const GeozoneBridgesService = ETS_API_FACTORY.createApiServiceAdapter(
  'gormost/bridges',
);
export const GeozonePedestrianTunnelsService = ETS_API_FACTORY.createApiServiceAdapter(
  'gormost/pedestrian_tunnels',
);
export const GeozonePedestrianTunnelExitsService = ETS_API_FACTORY.createApiServiceAdapter(
  'gormost/pedestrian_tunnel_exits',
);

export const GeozoneMunicipalFacilityService = ETS_API_FACTORY.createApiServiceAdapter(
  'geozone_municipal_facility',
);

/* Reports - Отчеты */
export const MissionReportsService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_travel_report',
);
export const WaybillJournalReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'waybill_journal_report',
);
export const WaybillsReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'waybills_report',
);
export const AnalyticsService = ETS_API_FACTORY.createApiServiceAdapter(
  'analytical_reports',
);
export const CarFuncTypeUsageReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_usage_by_company',
);
export const CarFuncTypeUsageDetailReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'car_usage_by_func_type',
);
export const OdhCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'odh_coverage_report',
);
export const DtCoverageReportService = ETS_API_FACTORY.createApiServiceAdapter(
  'dt_coverage_report',
);

export const AutoBase = ETS_API_FACTORY.createApiServiceAdapter('autobase');
export const CarDrivers = ETS_API_FACTORY.createApiServiceAdapter(
  'car_drivers',
);
export const AutoBaseBatteryRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/battery_registry',
);
export const CarRegistrationRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/car_registration_registry',
);
export const CarPassportRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/car_passport_registry',
);
export const CarPassportGibddRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/car_passport_gibdd_registry',
);
export const CarPassportGtnRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/car_passport_gtn_registry',
);
export const TachographService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_registry');
export const TachographRepairService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_repair');
export const TachographMetrologicalVerificationService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_metrological_verification');
export const TachographDataReadingService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_data_reading');
export const TachographReplacementSkziService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_replacement_skzi');
export const TachographBrandService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_brand');
export const TachographReplacementSkziReasonService = ETS_API_FACTORY.createApiServiceAdapter('autobase/tachograph_replacement_skzi_reason');
export const RefillService = ETS_API_FACTORY.createApiServiceAdapter('refill_registry');
export const RefillPrintService = ETS_API_FACTORY.createApiServiceAdapter('refill_registry/export');

export const Repair = ETS_API_FACTORY.createApiServiceAdapter('repair');
export const ContractorService = ETS_API_FACTORY.createApiServiceAdapter(
  'repair/contractor',
);
export const StateProgramService = ETS_API_FACTORY.createApiServiceAdapter(
  'repair/state_program',
);
export const StateProgramStatusService = ETS_API_FACTORY.createApiServiceAdapter(
  'repair/state_program_status',
);

/* DITETS-2079 */
export const WorkMode = ETS_API_FACTORY.createApiServiceAdapter('work_mode');

/* DITETS-2080 */
export const FuelEvent = ETS_API_FACTORY.createApiServiceAdapter('fuel_event');

// список стран
export const Country = ETS_API_FACTORY.createApiServiceAdapter('country');
export const CountryService = ETS_API_FACTORY.createApiServiceAdapter(
  'country',
);

export const UserNotificationService = ETS_API_FACTORY.createApiServiceAdapter(
  'notification_registry',
);
export const UserNotificationInfoService = ETS_API_FACTORY.createApiServiceAdapter(
  'notification_info',
);
export const UserAdmNotificationService = ETS_API_FACTORY.createApiServiceAdapter(
  'notification_adm_registry',
);

export const ObjectProperty = ETS_API_FACTORY.createApiServiceAdapter(
  'object_property',
);

/* московское время */
export const TimeMoscowService = ETS_API_FACTORY.createApiServiceAdapter(
  'time',
);

export { reports };

/* Измнение роли */
export const ChangeRoleService = ETS_API_FACTORY.createApiServiceAdapter(
  'change_role',
);
export const ChangeRoleServiceEtsTest = ETS_API_FACTORY_ETS_TEST.createApiServiceAdapter(
  'change_role',
);

/* DITETS-2142 */
export const CleaningOneNormService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning/one_norm',
  {},
);
export const CleaningNormRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning/norm_registry',
);
export const CleaningMunicipalFacilityService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning/municipal_facility',
);
export const CleaningMunicipalFacilityMeasureUnitService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning/municipal_facility_measure_unit',
);

export const MissionSourceService = ETS_API_FACTORY.createApiServiceAdapter(
  'mission_source',
  {},
);
export const ChangeRole = ETS_API_FACTORY.createApiServiceAdapter(
  'change_role',
);

// Список причин отмены задания
export const MissionCancelReasonsService = ETS_API_FACTORY.createApiServiceAdapter(
  'mission_cancel_reasons',
);

// Инспекции
export const InspectionService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspection',
);
export const InspectionActService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspection/act',
);
export const InspectRegistryService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspect/registry',
);
export const InspectAutobaseService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspect/autobase',
);
export const InspectPgmBaseService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspect/pgm_base',
);
export const InspectCarsConditionService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspect/cars_condition',
);
export const InspectContainerService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspection/container',
);
export const InspectCarsService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspection/cars',
);
export const InspectionConfigService = ETS_API_FACTORY.createApiServiceAdapter(
  'inspection/config',
);

export const EdcRequestService = ETS_API_FACTORY.createApiServiceAdapter(
  'edc_request',
);
export const EdcRequestImportService = ETS_API_FACTORY.createApiServiceAdapter(
  'import/edc_request',
);
export const EdcRequestChangeStatusService = ETS_API_FACTORY.createApiServiceAdapter(
  'edc/request',
);
export const EdcCancelReasonService = ETS_API_FACTORY.createApiServiceAdapter(
  'edc/cancel_reason',
);
export const EdcRejectionReasonService = ETS_API_FACTORY.createApiServiceAdapter(
  'edc/rejection_reason',
);
export const SensorTypeService = ETS_API_FACTORY.createApiServiceAdapter(
  'sensor_type',
);
export const RefillTypeService = ETS_API_FACTORY.createApiServiceAdapter(
  'refill_type',
);

export const ServicesService = ETS_API_FACTORY.createApiServiceAdapter(
  'services',
);

export const CarsTravelTimeDetailService = ETS_API_FACTORY.createApiServiceAdapter(
  'cars_travel_time/detail',
);

export const EdcRequestInfoDetailService = ETS_API_FACTORY.createApiServiceAdapter(
  'edc/request',
);

export const CleaningAreaRateService = ETS_API_FACTORY.createApiServiceAdapter(
  'cleaning_area_rate',
);
export const EngineTypeService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/engine_type',
);
export const EngineKindService = ETS_API_FACTORY.createApiServiceAdapter(
  'autobase/engine_kind',
);

export const TachographPeriodicVerificationService = ETS_API_FACTORY.createApiServiceAdapter(
  '/autobase/tachograph_periodic_verification',
);

export const TachographVerificationReasonService = ETS_API_FACTORY.createApiServiceAdapter(
  '/autobase/tachograph_verification_reason',
);
export const RefillFuelCompanyService = ETS_API_FACTORY.createApiServiceAdapter(
  'waybill_refill_tx',
);
