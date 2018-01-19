import { Store } from 'flummox';
import get from 'lodash/get';
import { notifications } from 'utils/notifications';

export default class NotificationsStore extends Store {

  constructor(flux) {
    super();

    const autoBaseActions = flux.getActions('autobase');
    const repairActions = flux.getActions('repair');
    const missionsActions = flux.getActions('missions');
    const objectsActions = flux.getActions('objects');
    const reportsActions = flux.getActions('reports');

    const saveNotificationQueue = [
      {
        actions: autoBaseActions,
        actionNames: [
          'batteryBrand',
          'batteryManufacturer',
          'batteryRegistry',
          'insurancePolicy',
          'repair',
          'repairCompany',
          'roadAccident',
          'sparePart',
          'techInspection',
          'techMaintOrder',
          'techMaint',
          'tire',
          'cloneTire',
        ],
        actionNotifications: {
          'batteryManufacturer': 'Новая запись успешно добавлена',
        },
      },
      {
        actions: repairActions,
        actionNames: [
          'contractor',
          'stateProgram',
          'programRegistry',
          'programVersionPut',
        ],
        actionNotifications: {
          'stateProgram': 'Запись успешно добавлена',
          'contractor': 'Запись успешно добавлена',
        },
      },
      {
        actions: objectsActions,
        actionNames: ['createMaintenanceRate', 'deleteMaintenanceRate'],
      },
      {
        actions: flux.getActions('odh'),
        actionNames: ['createODHNorm', 'updateODHNorm'],
      },
      {
        actions: flux.getActions('routes'),
        actionNames: ['createRoute', 'updateRoute', 'updateRoute'],
      },
      {
        actions: flux.getActions('waybills'),
        actionNames: ['updateWaybill', 'createWaybill'],
      },
      {
        actions: missionsActions,
        actionNames: [
          'createDutyMissionTemplate',
          'updateMissionTemplate',
          'createDutyMissions',
          'updateDutyMissionTemplate',
        ],
      },
    ];

    const removeNotificationQueue = [
      {
        actions: autoBaseActions,
        actionNames: [
          'removeBatteryBrand',
          'removeBatteryManufacturer',
          'removeBatteryRegistry',
          'removeInsurancePolicy',
          'removeRepair',
          'removeRepairCompany',
          'removeRoadAccident',
          'removeSparePart',
          'removeTechInspection',
          'removeTechMaintOrder',
          'removeTechMaint',
          'removeTire',
        ],
      },
      {
        actions: repairActions,
        actionNames: [
          'removeСontractor',
          'removeStateProgram',
          'removeProgramRegistry',
        ],
      },
      {
        actions: missionsActions,
        actionNames: [
          'removeDutyMission',    // // почему-то не работает handleRemove
        ],
      },
    ];

    saveNotificationQueue.forEach(opts =>
      opts.actionNames.forEach(name =>
        this.register(opts.actions[name], this.handleSave.bind(null, get(opts, ['actionNotifications', name], 'Данные успешно сохранены')))
    ));

    removeNotificationQueue.forEach(opts =>
      opts.actionNames.forEach(name =>
        this.register(opts.actions[name], this.handleRemove)
    ));


    // this.register(missionsActions.updateMissionFromReassignation, this.handleSave);
    // this.register(missionsActions.createMissionFromReassignation, this.handleSave);

    this.register(missionsActions.createMission, this.handleMissionCreate);
    this.register(missionsActions.createMissions, this.handleMissionsCreate);
    this.register(reportsActions.getOdhCoverageReport, this.handleGetCoverageReport);
    this.register(reportsActions.getDtCoverageReport, this.handleGetCoverageReport);


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

  handleSave(text) {
    global.NOTIFICATION_SYSTEM.notify(text, 'success');
  }

  handleRemove() {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  }
}
