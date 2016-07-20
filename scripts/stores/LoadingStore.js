import { Store } from 'flummox';

export default class LoadingStore extends Store {

  constructor(flux) {
    super();

    const objectsActionIds = flux.getActions('objects');
    const geoObjectsActions = flux.getActions('geoObjects');
    const waybillsActions  = flux.getActions('waybills');
    const fuelRateActions  = flux.getActions('fuelRates');
    const objectsActions   = flux.getActions('objects');
    const carActions       = flux.getActions('cars');
    const employeesActions = flux.getActions('employees');
    const missionsActons   = flux.getActions('missions');
    const routesActions    = flux.getActions('routes');
    const dashboardActions = flux.getActions('dashboard');
    const technicalOperationsActions = flux.getActions('technicalOperation');
    const companyStructureActions = flux.getActions('companyStructure');
    const reportsActions = flux.getActions('reports');

    this.reg(
      waybillsActions.deleteWaybill,
      waybillsActions.createWaybill,
      waybillsActions.updateWaybill,
      waybillsActions.getWaybills,

      fuelRateActions.getFuelRates,
      fuelRateActions.getFuelOperations,
      fuelRateActions.updateFuelRate,
      fuelRateActions.deleteFuelRate,
      fuelRateActions.createFuelRate,
      fuelRateActions.createFuelOperation,
      fuelRateActions.updateFuelOperation,
      fuelRateActions.getFuelRatesByCarModel,
      fuelRateActions.getEquipmentFuelRatesByCarModel,

      objectsActions.getCars,
      objectsActions.getModels,
      objectsActions.getSpecialModels,
      objectsActions.getCustomers,
      objectsActions.getOwners,
      objectsActions.getTypes,
      objectsActions.getFuelTypes,
      objectsActions.getWorkKinds,
      objectsActions.getFaxogramms,

      /* Geoobjects */
      geoObjectsActions.getODHs,
      geoObjectsActions.updateODH,
      geoObjectsActions.getDTs,
      geoObjectsActions.updateDT,
      geoObjectsActions.getSSPs,
      geoObjectsActions.getCarpools,
      geoObjectsActions.getFuelingWaterStations,
      geoObjectsActions.getDangerZones,
      geoObjectsActions.getGeozoneByTypeWithGeometry,

      carActions.updateCarAdditionalInfo,
      carActions.getTrack,
      carActions.getCarsByTechnicalOperation,

      employeesActions.getEmployees,
      employeesActions.updateEmployee,
      employeesActions.createEmployee,
      employeesActions.deleteEmployee,
      employeesActions.getDrivers,

      missionsActons.getMissions,
      missionsActons.getMissionReassignationParameters,
      missionsActons.createMissionFromReassignation,
      missionsActons.updateMissionFromReassignation,
      missionsActons.getMissionsByCarAndDates,
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
      reportsActions.getCoverageReport

    );

    this.state = {
      operationsCount: 0,
    };
  }

  reg(...actions) {
    actions.forEach(action => this.registerAsync(action, this.inc.bind(this, action), this.dec, this.dec));
  }

  isLoading() {
    return this.state.operationsCount > 0;
  }

  inc(action) {
    //console.info(action); // to watch actions stack
    let { operationsCount } = this.state;

    operationsCount++;

    this.setState({ operationsCount });
  }

  dec() {
    let { operationsCount } = this.state;

    operationsCount--;

    this.setState({ operationsCount });
  }

}
