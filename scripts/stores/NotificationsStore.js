import { Store } from 'flummox';
import { notifications } from '../utils/notifications.js';

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


    this.register(missionsActons.createMission, this.handleMissionCreate);

    this.state = {
      operationsCount: 0,
    };
  }

  checkResponse(response) {
    if (response.errors.length === 0) {
      return true;
    }
    return false;
  }

  handleMissionCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM._addNotification(notifications.missionCreateSuccessNotification)
    }
  }

}
