import { Store } from 'flummox';

export default class LoadingStore extends Store {

  constructor(flux) {
    super();

    const geoObjectsActions = flux.getActions('geoObjects');
    const waybillsActions = flux.getActions('waybills');
    const fuelRateActions = flux.getActions('fuelRates');
    const objectsActions = flux.getActions('objects');
    const carActions = flux.getActions('cars');
    const employeesActions = flux.getActions('employees');
    const missionsActons = flux.getActions('missions');
    const routesActions = flux.getActions('routes');
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const companyStructureActions = flux.getActions('companyStructure');
    const reportsActions = flux.getActions('reports');

    this.reg(false,
      waybillsActions.deleteWaybill,
      waybillsActions.createWaybill,
      waybillsActions.updateWaybill,
      waybillsActions.getWaybills,
      waybillsActions.getWaybill,
      waybillsActions.getLastClosedWaybill,

      fuelRateActions.getFuelRates,
      fuelRateActions.getFuelOperations,
      fuelRateActions.updateFuelRate,
      fuelRateActions.deleteFuelRate,
      fuelRateActions.createFuelRate,
      fuelRateActions.createFuelOperation,
      fuelRateActions.updateFuelOperation,
      fuelRateActions.getFuelRatesByCarModel,
      fuelRateActions.getEquipmentFuelRatesByCarModel,

      objectsActions.getModels,
      objectsActions.getTypes,
      objectsActions.getCars,
      objectsActions.getSpecialModels,
      objectsActions.getCustomers,
      objectsActions.getWorkKinds,
      objectsActions.getFaxogramms,
      objectsActions.getMaintenanceWork,
      objectsActions.getCleaningRate,
      objectsActions.getUserActionLog,

      employeesActions.getEmployees,
      employeesActions.updateEmployee,
      employeesActions.createEmployee,
      employeesActions.deleteEmployee,
      employeesActions.getDrivers,

      missionsActons.getMissions,
      missionsActons.getMissionReassignationParameters,
      missionsActons.createMissionFromReassignation,
      missionsActons.updateMissionFromReassignation,
      missionsActons.getMissionById,
      missionsActons.getMissionSources,
      missionsActons.createMission,
      missionsActons.removeMission,
      missionsActons.updateMission,
      missionsActons.getMissionTemplates,
      missionsActons.createMissionTemplate,
      missionsActons.removeMissionTemplate,
      missionsActons.getMissionReports,
      missionsActons.createMissionReport,
      missionsActons.getMissionReportById,
      missionsActons.createMissions,
      missionsActons.getDutyMissions,
      missionsActons.createDutyMission,
      missionsActons.updateDutyMission,
      missionsActons.removeDutyMission,
      missionsActons.getDutyMissionTemplates,
      missionsActons.createDutyMissionTemplate,
      missionsActons.updateDutyMissionTemplate,
      missionsActons.removeDutyMissionTemplate,
      missionsActons.printMission,
      missionsActons.printDutyMission,

      routesActions.getRoutes,
      routesActions.createRoute,
      routesActions.removeRoute,
      routesActions.updateRoute,
      routesActions.getRouteById,
      routesActions.getRouteReports,
      routesActions.getRouteReportById,
      routesActions.getRouteReports,
      routesActions.createRouteReport,
      routesActions.validateRoute,
      routesActions.getGeozones,
      routesActions.getRoutesByTechnicalOperation,
      routesActions.getRoutesByMissionId,
      routesActions.getRoutesByDutyMissionId,

      technicalOperationsActions.getTechnicalOperations,
      technicalOperationsActions.getTechnicalOperationsWithBrigades,
      technicalOperationsActions.getTechnicalOperationsObjects,
      technicalOperationsActions.updateTechnicalOperation,
      technicalOperationsActions.getTechnicalOperationsByCarId,

      companyStructureActions.getCompanyStructure,
      companyStructureActions.getCompanyList,
      companyStructureActions.getLinearCompanyStructure,
      companyStructureActions.getLinearCompanyStructureForUser,
      companyStructureActions.updateCompanyElement,
      companyStructureActions.createCompanyElement,
      companyStructureActions.deleteCompanyElement,

      reportsActions.getDailyCleaningReportsETS,
      reportsActions.getDailyCleaningReportByIdETS,
      reportsActions.createDailyCleaningReportETS,
      reportsActions.getDailyCleaningReportsCAFAP,
      reportsActions.getDailyCleaningReportByIdCAFAP,
      reportsActions.createDailyCleaningReportCAFAP,
      reportsActions.getFuelReport,
      reportsActions.getAnalytics,
      reportsActions.getWeeklyTechnicalOperationCompleteReports,
      reportsActions.getWeeklyTechnicalOperationCompleteReportById,
      reportsActions.createWeeklyTechnicalOperationCompleteReport,
      reportsActions.getCoverageReport,
      reportsActions.getOdhCoverageReport,
      reportsActions.getDtCoverageReport,
      reportsActions.getCarFuncTypeUsageReports,
      reportsActions.getBrigadeEfficiencyReports,
      reportsActions.getEmployeeEfficiencyReports,

    );

    this.reg(true,
      geoObjectsActions.getODHs,
      geoObjectsActions.updateODH,
      geoObjectsActions.getDTs,
      geoObjectsActions.updateDT,
      geoObjectsActions.getGeozoneByTypeWithGeometry,
      geoObjectsActions.getGeozoneByType,

      carActions.updateCarAdditionalInfo,
      carActions.getTrack,
      carActions.getCarsByTechnicalOperation,
      carActions.getCarMissionsByTimestamp,

      missionsActons.getMissionsByCarAndDates,
    );

    this.state = {
      operationsCount: 0,
      lazyOperationsCount: 0
    };
  }

  reg(lazy, ...actions) {
    actions.forEach(action => this.registerAsync(action,
      () => this.inc(action, lazy),
      () => this.dec(lazy),
      () => this.dec(lazy)
    ));
  }

  inc(action, lazy) {
    if (lazy) {
      let { lazyOperationsCount } = this.state;
      lazyOperationsCount += 1;
      this.setState({ lazyOperationsCount });
    } else {
      let { operationsCount } = this.state;
      operationsCount += 1;
      this.setState({ operationsCount });
    }
  }

  dec(lazy) {
    if (lazy) {
      let { lazyOperationsCount } = this.state;
      lazyOperationsCount -= 1;
      this.setState({ lazyOperationsCount });
    } else {
      let { operationsCount } = this.state;
      operationsCount -= 1;
      this.setState({ operationsCount });
    }
  }

  isLoading() {
    return this.state.operationsCount > 0;
  }

  isLazyLoading() {
    return this.state.lazyOperationsCount > 0;
  }

}
