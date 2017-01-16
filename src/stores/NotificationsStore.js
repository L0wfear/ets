import { Store } from 'flummox';
import { notifications } from 'utils/notifications';

export default class NotificationsStore extends Store {

  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
    const reportsActions = flux.getActions('reports');
    const routesActions = flux.getActions('routes');
    const waybillsActions = flux.getActions('waybills');

    this.register(missionsActons.createMission, this.handleMissionCreate);
    this.register(missionsActons.createMissions, this.handleMissionsCreate);
    this.register(reportsActions.getOdhCoverageReport, this.handleGetCoverageReport);
    this.register(reportsActions.getDtCoverageReport, this.handleGetCoverageReport);

    this.register(missionsActons.updateMission, this.handleSave);
    this.register(missionsActons.updateMissionTemplate, this.handleSave);
    this.register(missionsActons.createDutyMissions, this.handleSave);
    this.register(missionsActons.updateDutyMissionTemplate, this.handleSave);
    this.register(missionsActons.createDutyMissionTemplate, this.handleSave);
    // this.register(missionsActons.updateMissionFromReassignation, this.handleSave);
    // this.register(missionsActons.createMissionFromReassignation, this.handleSave);
    this.register(routesActions.createRoute, this.handleSave);
    this.register(routesActions.updateRoute, this.handleSave);
    this.register(routesActions.updateRoute, this.handleSave);
    this.register(waybillsActions.updateWaybill, this.handleSave);
    this.register(waybillsActions.createWaybill, this.handleSave);

    this.state = {
      operationsCount: 0,
    };
  }

  checkResponse(response) {
    let valid = false;
    if (Array.isArray(response)) {
      valid = response.filter(obj => obj.errors && obj.errors.length > 0).length === 0;
    } else if (!response.errors || response.errors.length === 0) {
      valid = true;
    }
    return valid;
  }

  handleMissionCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM.notify(notifications.missionCreateSuccessNotification);
    }
  }

  handleMissionsCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM.notify(notifications.missionsCreationSuccessNotification);
    }
  }

  handleGetCoverageReport() {
    global.NOTIFICATION_SYSTEM.notify('Отчет обновлен', 'info');
  }

  handleSave() {
    global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
  }

}
