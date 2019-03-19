import ETS_API_FACTORY from 'api/EtsAPIServiceFactory';

export const MedicalStatsService = ETS_API_FACTORY.createApiServiceAdapter('medical_stats', {});
export const SensorTypeService = ETS_API_FACTORY.createApiServiceAdapter('sensor_type', {});
