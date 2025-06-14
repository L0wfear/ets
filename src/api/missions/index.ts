import ETS_API_FACTORY from 'api/EtsAPIServiceFactory';

export const MissionService = ETS_API_FACTORY.createApiServiceAdapter('mission', {});
export const ColumnMissionService = ETS_API_FACTORY.createApiServiceAdapter('mission/column', {});
export const MissionArchiveService = ETS_API_FACTORY.createApiServiceAdapter('mission_archive', {});

export const MissionReassignationService = ETS_API_FACTORY.createApiServiceAdapter('mission_reassignation', {});
export const MissionTemplateService = ETS_API_FACTORY.createApiServiceAdapter('mission_template', {});
export const MissionTemplateCarService = ETS_API_FACTORY.createApiServiceAdapter('filters/mission_template/cars', {});
export const MissionSourceService = ETS_API_FACTORY.createApiServiceAdapter('mission_source', {});
export const DutyMissionService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission', {});
export const DutyMissionArchiveService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission_archive', {});

export const CarDutyMissionService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission_car_mission/', {});
export const DutyMissionTemplateService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission_template', {});
export const MissionPrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_mission', {});
export const MissionTemplatePrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_mission_template', {});

export const DutyMissionPrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_duty_mission', {});
export const MissionDataService = ETS_API_FACTORY.createApiServiceAdapter('mission_data', {});

/* DITETS-2142 */
export const Cleaning = ETS_API_FACTORY.createApiServiceAdapter('cleaning', {});
