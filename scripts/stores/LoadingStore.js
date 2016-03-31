import { Store } from 'flummox';

export default class LoadingStore extends Store {

  constructor(flux) {
    super();

    const objectsActionIds = flux.getActionIds('objects');
    const waybillsActions  = flux.getActionIds('waybills');
    const fuelRateActions  = flux.getActionIds('fuel-rates');
    const objectsActions   = flux.getActionIds('objects');
    const carActions       = flux.getActionIds('car');
    const employeesActions = flux.getActionIds('employees');
    const missionsActons   = flux.getActionIds('missions');
    const routesActions    = flux.getActionIds('routes');
    const dashboardActions = flux.getActionIds('dashboard');
    const technicalOperationsActions = flux.getActionIds('technical_operation');
    const companyStructureActions = flux.getActions('company-structure');

    this.reg(
      waybillsActions.delete,
      waybillsActions.create,
      waybillsActions.update,
      waybillsActions.get,

      fuelRateActions.getFuelRates,
      fuelRateActions.getFuelOperations,
      fuelRateActions.updateFuelRate,
      fuelRateActions.deleteFuelRate,
      fuelRateActions.addFuelRate,
      fuelRateActions.getFuelRatesByCarModel,

      objectsActions.getCars,
      objectsActions.getModels,
      objectsActions.getCustomers,
      objectsActions.getOwners,
      objectsActions.getOkrugs,
      objectsActions.getTypes,
      objectsActions.getFuelTypes,
      objectsActions.getWorkKinds,
      objectsActions.getFaxogramms,
      objectsActions.getCarFuncTypes,
      objectsActions.getODHs,
      objectsActions.updateODH,

      carActions.updateCarAdditionalInfo,

      employeesActions.getEmployees,
      employeesActions.updateEmployee,

      missionsActons.getMissions,
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
      companyStructureActions.getPlainCompanyStructure,
      companyStructureActions.updateCompanyElement,
      companyStructureActions.createCompanyElement,
      companyStructureActions.deleteCompanyElement,

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
