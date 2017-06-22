import ETS_API_FACTORY from 'api/EtsAPIServiceFactory';

export const MissionService = ETS_API_FACTORY.createApiServiceAdapter('mission', {});
export const MissionReassignationService = ETS_API_FACTORY.createApiServiceAdapter('mission_reassignation', {});
export const MissionTemplateService = ETS_API_FACTORY.createApiServiceAdapter('mission_template', {});
export const MissionSourceService = ETS_API_FACTORY.createApiServiceAdapter('mission_source', {});
export const MissionTemplatesForFaxogramm = ETS_API_FACTORY.createApiServiceAdapter('get_mission_templates_for_faxogramm', {});
export const DutyMissionService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission', {});
export const CarDutyMissionService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission_car_mission/', {});
export const DutyMissionTemplateService = ETS_API_FACTORY.createApiServiceAdapter('duty_mission_template', {});
export const MissionPrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_mission', {});
export const DutyMissionPrintService = ETS_API_FACTORY.createApiServiceAdapter('plate_duty_mission', {});
export const MissionDataService = ETS_API_FACTORY.createApiServiceAdapter('mission_data', {});
