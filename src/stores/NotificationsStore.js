import { Store } from 'flummox';
import get from 'lodash/get';
import { notifications } from 'utils/notifications';

export default class NotificationsStore extends Store {
  constructor(flux) {
    super();

    const repairActions = flux.getActions('repair');
    const missionsActions = flux.getActions('missions');

    const saveNotificationQueue = [
      {
        actions: repairActions,
        actionNames: [
          'contractor',
          'stateProgram',
          'programRegistry',
          'programVersionPut',
        ],
        actionNotifications: {
          stateProgram: 'Запись успешно добавлена',
          contractor: 'Запись успешно добавлена',
        },
      },
      {
        actions: flux.getActions('waybills'),
        actionNames: ['updateWaybill', 'createWaybill'],
      },
    ];

    const removeNotificationQueue = [
      {
        actions: repairActions,
        actionNames: ['removeStateProgram', 'removeProgramRegistry'],
      },
    ];

    saveNotificationQueue.forEach((opts) =>
      opts.actionNames.forEach((name) =>
        this.register(
          opts.actions[name],
          this.handleSave.bind(
            null,
            get(
              opts,
              ['actionNotifications', name],
              'Данные успешно сохранены',
            ),
          ),
        ),
      ),
    );

    removeNotificationQueue.forEach((opts) =>
      opts.actionNames.forEach((name) =>
        this.register(opts.actions[name], this.handleRemove),
      ),
    );

    this.register(missionsActions.createMissions, this.handleMissionsCreate);

    this.state = {
      operationsCount: 0,
    };
  }

  checkResponse(response) {
    let valid = false;
    if (Array.isArray(response)) {
      valid
        = response.filter((obj) => obj.errors && obj.errors.length > 0).length
        === 0;
    } else if (!response.errors || response.errors.length === 0) {
      valid = true;
    }
    return valid;
  }

  handleMissionCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM.notify(
        notifications.missionCreateSuccessNotification,
      );
    }
  }

  handleMissionsCreate(response) {
    if (this.checkResponse(response)) {
      global.NOTIFICATION_SYSTEM.notify(
        notifications.missionsCreationSuccessNotification,
      );
    }
  }

  handleSave(text) {
    global.NOTIFICATION_SYSTEM.notify(text, 'success');
  }

  handleRemove() {
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  }
}
