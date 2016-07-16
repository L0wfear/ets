import { Store } from 'flummox';
import { notifications } from 'utils/notifications';

export default class NotificationsStore extends Store {

  constructor(flux) {
    super();

    const objectsActionIds = flux.getActions('objects');
    const waybillsActions  = flux.getActions('waybills');
    const fuelRateActions  = flux.getActions('fuelRates');
    const objectsActions   = flux.getActions('objects');
    const carActions       = flux.getActions('cars');
    const employeesActions = flux.getActions('employees');
    const missionsActons   = flux.getActions('missions');
    const routesActions    = flux.getActions('routes');
    const dashboardActions = flux.getActions('dashboard');

    this.register(missionsActons.createMission, this.handleMissionCreate);
    this.register(missionsActons.createMissions, this.handleMissionsCreate);

    this.state = {
      operationsCount: 0,
    };
  }

  checkResponse(response) {
    let valid = false;
    if (_.isArray(response)) {
      valid = response.filter(obj => obj.errors && obj.errors.length > 0).length === 0;
    } else if (!response.errors || response.errors.length === 0) {
      valid = true;
    }
    return valid;
  }

  handleMissionCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM._addNotification(notifications.missionCreateSuccessNotification);
    }
  }

  handleMissionsCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM._addNotification(notifications.missionsCreationSuccessNotification);
    }
  }

}
