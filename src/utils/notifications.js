import { makeReactMessange } from '/home/uoiasfy/all/chch/ets-frontend/src/utils/helpMessangeWarning.jsx';

export const loginErrorNotification = {
  title: 'Ошибка',
  message: 'Ошибка авторизации: время действия сессии истекло',
  level: 'error',
  dismissible: false,
  position: 'tc',
  autoDismiss: 5,
  action: {
    label: 'Перейти на страницу авторизации',
    callback() {
      window.location.hash = '/login';
      window.location.reload();
    },
  },
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
    autoDismiss: 5,
    action: {
      label: 'Перезагрузить',
      callback: () => window.location.reload(),
    },
  };
}

export function getServerErrorNotification(errorService) {
  return {
    title: 'Ошибка',
    message: `Ошибка при получении данных с сервера, сервис ${errorService}`,
    level: 'error',
    dismissible: true,
    position: 'tr',
    autoDismiss: 5,
    action: {
      label: 'Перезагрузить страницу',
      callback: () => window.location.reload(),
    },
  };
}

export function getReportNotReadyNotification2() {
  return {
    title: 'Внимание',
    message: 'Отчет еще не обработан',
    level: 'info',
    dismissible: true,
    position: 'tc',
    autoDismiss: 5,
  };
}

const missionCreateSuccessNotification = {
  title: '',
  message: 'Задание создано успешно',
  level: 'success',
  dismissible: false,
  position: 'tc',
  autoDismiss: 3,
};

const missionsByCarAndDateUpdateNotification = {
  title: '',
  message: 'Доступные для выбранного ТС и интервала времени задания изменены',
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 5,
};

export const saveDataSuccessNotification = {
  title: '',
  message: 'Данные успешно сохранены',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 5,
};

export const reassignMissionSuccessNotification = {
  title: '',
  message: 'Запись успешно сохранена',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 5,
};

export const notifications = {
  missionCreateSuccessNotification,
  missionsCreationSuccessNotification,
  missionsByCarAndDateUpdateNotification,
};

export function getWarningNotification(message) {
  return {
    title: 'Внимание',
    level: 'warning',
    dismissible: true,
    position: 'tr',
    autoDismiss: 5,
    children: makeReactMessange(message),
  };
}

export function noItemsInfoNotification(msg = 'По данному запросу нет записей') {
  global.NOTIFICATION_SYSTEM.notify(msg, 'info');
}

export function hasWarningNotification(response) {
  if (response.warnings) {
    if (Array.isArray(response.warnings)) {
      response.warnings.forEach((w) => {
        !w.hidden && global.NOTIFICATION_SYSTEM.notify(getWarningNotification(w.message || w));
      });
    } else if ((response.warnings && response.warnings.message) || typeof response.warnings === 'string') {
      !response.warnings.hidden && global.NOTIFICATION_SYSTEM.notify(getWarningNotification(response.warnings.message || response.warnings));
    }
    return true;
  }

  return false;
}
