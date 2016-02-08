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

    this.reg(
      //objectsActionIds.addNewGroup,
      waybillsActions.removeWaybill,
      waybillsActions.createWaybill,
      waybillsActions.getWaybills,

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
      objectsActions.getTechOperations,
      objectsActions.getWorkKinds,

      carActions.updateCarAdditionalInfo,

      employeesActions.getEmployees,
      employeesActions.updateEmployee,

      missionsActons.getMissions,
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

      routesActions.getRoutes,
      routesActions.createRoute,
      routesActions.removeRoute,
      routesActions.updateRoute,
      routesActions.getRouteById,
      routesActions.getRouteReports,
      routesActions.getRoutesVector,
      routesActions.removeRouteVector,
      routesActions.createVectorRoute,
      routesActions.getRouteVectorById,
      routesActions.getRouteReportById,
      routesActions.getRouteReports,
      routesActions.createRouteReport,
      routesActions.validateRoute,
      routesActions.getGeozones,
      routesActions.updateRouteVector,


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
