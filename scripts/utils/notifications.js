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

export const missionCreationSuccessNotification = {
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


export function getReportNotReadyNotification(flux) {
  return {
    title: 'Внимание',
    message: `Отчет еще не обработан`,
    level: 'info',
    dismissible: false,
    position: 'tc',
    autoDismiss: 0,
    action: {
      label: 'Обновить список',
      callback: () => flux.getActions('missions').getMissionReports(),
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

export const notifications = {
  missionCreateSuccessNotification
}
