import { Store } from 'flummox';

let notTime = true;
export default class LoadingStore extends Store {

  constructor(flux) {
    super();

    const sessionActions = flux.getActions('session');
    const autoBaseActions = flux.getActions('autobase');
    const repairActions = flux.getActions('repair');
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
      sessionActions.cahngeCompanyOnAnother,

      autoBaseActions.getAutobaseListByType,
      autoBaseActions.batteryBrand,
      autoBaseActions.batteryManufacturer,
      autoBaseActions.batteryRegistry,
      autoBaseActions.insurancePolicy,
      autoBaseActions.repair,
      autoBaseActions.repairCompany,
      autoBaseActions.roadAccident,
      autoBaseActions.sparePart,
      autoBaseActions.techInspection,
      autoBaseActions.techMaintOrder,
      autoBaseActions.techMaint,
      autoBaseActions.tire,

      repairActions.getRepairListByType,
      repairActions.getObjectProperty,
      repairActions.contractor,
      repairActions.removeСontractor,
      repairActions.programRegistry,
      repairActions.removeProgramRegistry,
      repairActions.stateProgram,
      repairActions.removeStateProgram,
      repairActions.programObject,
      repairActions.removeProgramObject,
      repairActions.programRemark,
      repairActions.removeProgramRemark,
      repairActions.rejectRemarks,
      repairActions.fixRemarks,
      repairActions.postDataToUpdateObjectPercent,
      repairActions.getDataAboutObjectById,
      repairActions.removePercent,

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
      objectsActions.getOrders,

      objectsActions.saveOrder,
      objectsActions.getMaintenanceWork,
      objectsActions.getCleaningRate,
      objectsActions.getUserActionLog,
      objectsActions.getMedicalStats,
      objectsActions.getOrganizations,
      objectsActions.createMaintenanceWork,
      objectsActions.updateMaintenanceWork,

      employeesActions.getEmployees,
      employeesActions.updateEmployee,
      employeesActions.createEmployee,
      employeesActions.deleteEmployee,
      employeesActions.getDrivers,
      employeesActions.getWaybillDrivers,
      employeesActions.getForemans,
      employeesActions.getEmployeeOnCarList,

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
      missionsActons.printMissionTemplate,
      missionsActons.createMissionTemplate,
      missionsActons.removeMissionTemplate,
      missionsActons.createMissions,
      missionsActons.getDutyMissions,
      missionsActons.getCarDutyMissions,
      missionsActons.createDutyMission,
      missionsActons.updateDutyMission,
      missionsActons.removeDutyMission,
      missionsActons.getDutyMissionTemplates,
      missionsActons.createDutyMissionTemplate,
      missionsActons.updateDutyMissionTemplate,
      missionsActons.removeDutyMissionTemplate,
      missionsActons.printMission,
      missionsActons.printDutyMission,
      missionsActons.getCleaningMunicipalFacilityList,

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
      routesActions.getRoutesBySomeData,
      routesActions.getRoutesByTechnicalOperation,
      routesActions.getRoutesByMissionId,
      routesActions.getRoutesByDutyMissionId,

      technicalOperationsActions.getTechnicalOperations,
      technicalOperationsActions.getTechnicalOperationsWithBrigades,
      technicalOperationsActions.getTechnicalOperationsObjects,
      technicalOperationsActions.updateTechnicalOperation,
      technicalOperationsActions.getTechnicalOperationsByCarId,
      technicalOperationsActions.getTechOperationsByNormIds,
      technicalOperationsActions.getTechnicalOperationRelations,

      companyStructureActions.getCompanyStructure,
      companyStructureActions.updateCompanyElement,
      companyStructureActions.createCompanyElement,
      companyStructureActions.deleteCompanyElement,

      reportsActions.getAnalytics,
      reportsActions.getCoverageReport,
      reportsActions.getOdhCoverageReport,
      reportsActions.getDtCoverageReport,

      carActions.updateCarAdditionalInfo,
      carActions.getDataByNormNormatives,

      geoObjectsActions.getGeozones,
      geoObjectsActions.getOdhMkad,
    );

    this.reg(true,
      geoObjectsActions.getODHs,
      geoObjectsActions.updateODH,
      geoObjectsActions.updateDT,
      geoObjectsActions.getGeozoneByTypeWithGeometry,
      geoObjectsActions.getGeozoneByType,

      carActions.getTrack,
      carActions.getCarsByTechnicalOperation,
      carActions.getCarMissionsByTimestamp,

      missionsActons.getMissionsByCarAndDates,
    );

    this.state = {
      operationsCount: 0,
      lazyOperationsCount: 0,
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
    if (__DEVELOPMENT__) {
      if (this.state.operationsCount > 0 && notTime) {
        console.time('----> timeLoad');
        notTime = false;
      }
      if (this.state.operationsCount === 0 && !notTime) {
        console.timeEnd('----> timeLoad');
        notTime = true;
      }
    }
    return this.state.operationsCount > 0;
  }

  isLazyLoading() {
    return this.state.lazyOperationsCount > 0;
  }

}
