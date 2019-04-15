import { Store } from 'flummox';

let notTime = true;
export default class LoadingStore extends Store {
  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    const waybillsActions = flux.getActions('waybills');
    const fuelRateActions = flux.getActions('fuelRates');
    const objectsActions = flux.getActions('objects');
    const employeesActions = flux.getActions('employees');
    const missionsActons = flux.getActions('missions');
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
      fuelRateActions.getFuelRatesByCarModel,
      fuelRateActions.getEquipmentFuelRatesByCarModel,

      objectsActions.getTypes,
      objectsActions.getCars,
      objectsActions.getSomeCars,

      objectsActions.getUserActionLog,
      objectsActions.getMedicalStats,

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
      missionsActons.getCleaningMunicipalFacilityList,
      missionsActons.getCleaningOneNorm,

      technicalOperationsActions.getTechnicalOperations,
      technicalOperationsActions.getTechnicalOperationsObjects,
      technicalOperationsActions.getTechOperationsByNormIds,
      technicalOperationsActions.getTechnicalOperationRelations,
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
