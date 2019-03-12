import { Store } from 'flummox';

let notTime = true;
export default class LoadingStore extends Store {
  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    const waybillsActions = flux.getActions('waybills');
    const fuelRateActions = flux.getActions('fuelRates');
    const objectsActions = flux.getActions('objects');
    const carActions = flux.getActions('cars');
    const employeesActions = flux.getActions('employees');
    const missionsActons = flux.getActions('missions');
    const routesActions = flux.getActions('routes');
    const technicalOperationsActions = flux.getActions('technicalOperation');

    this.reg(
      false,
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
      objectsActions.getSomeCars,
      objectsActions.getWorkKinds,

      objectsActions.getMaintenanceWork,
      objectsActions.getCleaningRate,
      objectsActions.getUserActionLog,
      objectsActions.getMedicalStats,
      objectsActions.createMaintenanceWork,
      objectsActions.updateMaintenanceWork,

      employeesActions.getEmployees,
      employeesActions.getDrivers,
      employeesActions.getWaybillDrivers,
      employeesActions.getForemans,
      employeesActions.getEmployeeOnCarList,

      missionsActons.getMissions,
      missionsActons.getMissionReassignationParameters,
      missionsActons.createMissionFromReassignation,
      missionsActons.updateMissionFromReassignation,
      missionsActons.updateMission,
      missionsActons.printMissionTemplate,
      missionsActons.createMissions,
      missionsActons.getCarDutyMissions,
      missionsActons.printMission,
      missionsActons.getCleaningMunicipalFacilityList,
      missionsActons.getCleaningOneNorm,

      routesActions.getRouteById,
      routesActions.getRoutesBySomeData,
      routesActions.getRoutesByMissionId,

      technicalOperationsActions.getTechnicalOperations,
      technicalOperationsActions.getTechnicalOperationsWithBrigades,
      technicalOperationsActions.getTechnicalOperationsObjects,
      technicalOperationsActions.updateTechnicalOperation,
      technicalOperationsActions.getTechOperationsByNormIds,
      technicalOperationsActions.getTechnicalOperationRelations,

      carActions.updateCarAdditionalInfo,
    );

    this.reg(true, missionsActons.getMissionsByCarAndDates);

    this.state = {
      operationsCount: 0,
      lazyOperationsCount: 0,
    };
  }

  reg(lazy, ...actions) {
    actions.forEach((action) =>
      this.registerAsync(
        action,
        () => this.inc(action, lazy),
        () => this.dec(lazy),
        () => this.dec(lazy),
      ),
    );
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
        console.time('----> timeLoad'); // eslint-disable-line
        notTime = false;
      }
      if (this.state.operationsCount === 0 && !notTime) {
        console.timeEnd('----> timeLoad'); // eslint-disable-line
        notTime = true;
      }
    }
    return this.state.operationsCount > 0;
  }

  isLazyLoading() {
    return this.state.lazyOperationsCount > 0;
  }
}
