import ETS_API_FACTORY from './../EtsAPIServiceFactory';

export const BrigadeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter('reports/efficiency/brigade', {});
export const EmployeeEfficiencyReport = ETS_API_FACTORY.createApiServiceAdapter('reports/efficiency/employee', {});
export const FuelReportService = ETS_API_FACTORY.createApiServiceAdapter('fuel_consumption_report', {});
export const DailyCleaningReportsServiceETS = ETS_API_FACTORY.createApiServiceAdapter('cleaning_status_report', {});
