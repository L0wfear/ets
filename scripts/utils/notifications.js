export const loginErrorNotification = {
  title: 'Ошибка',
  message: 'Ошибка авторизации: время действия сессии истекло',
  level: 'error',
  dismissible: false,
  position: 'tc',
  autoDismiss: 0,
  action: {
    label: 'Перейти на страницу авторизации',
    callback: function() {
      window.location.hash = '/login';
      window.location.reload();
    }
  }
};

export const missionsCreationSuccessNotification = {
  title: 'Формирование заданий',
  message: 'Задания сформированы успешно',
  level: 'success',
  dismissible: false,
  position: 'tc',
  autoDismiss: 3,
};

export function getErrorNotification(error) {
  return {
    title: 'Ошибка',
    message: `Ошибка инициализации приложения: (${error})`,
    level: 'error',
    dismissible: false,
    position: 'tc',
    autoDismiss: 0,
    action: {
      label: 'Перезагрузить',
      callback: () => window.location.reload(),
    },
  };
};

export function getServerErrorNotification(errorService) {
  return {
    title: 'Ошибка',
    message: `Ошибка при получении данных с сервера, сервис ${errorService}`,
    level: 'error',
    dismissible: true,
    position: 'tr',
    autoDismiss: 0,
    action: {
      label: 'Перезагрузить страницу',
      callback: () => window.location.reload(),
    },
  };
};


export function getReportNotReadyNotification(flux) {
  return {
    title: 'Внимание',
    message: `Отчет еще не обработан`,
    level: 'info',
    dismissible: true,
    position: 'tc',
    autoDismiss: 0,
    action: {
      label: 'Обновить список',
      callback: () => flux.getActions('missions').getMissionReports(),
    },
  };
}

export function getReportNotReadyNotification2(flux) {
  return {
    title: 'Внимание',
    message: `Отчет еще не обработан`,
    level: 'info',
    dismissible: true,
    position: 'tc',
    autoDismiss: 0,
    action: {
      label: 'Обновить список',
      callback: () => flux.getActions('reports').getDailyCleaningReports(),
    },
  };
}

export function getReportNotReadyNotification3(flux) {
  return {
    title: 'Внимание',
    message: `Отчет еще не обработан`,
    level: 'info',
    dismissible: true,
    position: 'tc',
    autoDismiss: 0,
    action: {
      label: 'Обновить список',
      callback: () => flux.getActions('reports').getWeeklyTechnicalOperationCompleteReports(),
    },
  };
}

const missionCreateSuccessNotification = {
  title: '',
  message: 'Задание создано успешно',
  level: 'success',
  dismissible: false,
  position: 'tc',
  autoDismiss: 3,
}

const missionsByCarAndDateUpdateNotification = {
  title: '',
  message: 'Доступные для выбранного ТС и планируемых дат задания изменены',
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 2,
}

export const saveDataSuccessNotification = {
  title: '',
  message: 'Данные успешно сохранены',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 20,
}

export const notifications = {
  missionCreateSuccessNotification,
  missionsCreationSuccessNotification,
  missionsByCarAndDateUpdateNotification
}

export function getWarningNotification(message) {
  return {
    title: 'Внимание',
    message: `${message}`,
    level: 'warning',
    dismissible: false,
    position: 'tr',
    autoDismiss: 3,
  };
}
