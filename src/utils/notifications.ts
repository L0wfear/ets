import { makeReactMessage } from 'utils/helpMessangeWarning';

export const loginErrorNotification = {
  title: 'Ошибка!',
  message: 'Ошибка авторизации: время действия сессии истекло.',
  level: 'error',
  dismissible: true,
  position: 'tc',
  autoDismiss: 0,
  action: {
    label: 'Перейти на страницу авторизации.',
    callback() {
      window.location.hash = '/login';
      window.location.reload();
    },
  },
};

export const missionsCreationSuccessNotification = {
  title: 'Формирование заданий.',
  message: 'Задания сформированы успешно.',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 5,
};

export function getErrorNotification(error) {
  return {
    title: 'Ошибка!',
    message: `Ошибка инициализации приложения: (${error})`,
    level: 'error',
    dismissible: true,
    position: 'tc',
    autoDismiss: 0,
    action: {
      label: 'Перезагрузить',
      callback: () => window.location.reload(),
    },
  };
}

export function getServerErrorNotification(errorService) {
  return {
    title: 'Ошибка!',
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
}

export function getReportNotReadyNotification2() {
  return {
    title: 'Внимание!',
    message: 'Отчет еще не обработан.',
    level: 'info',
    dismissible: true,
    position: 'tc',
    autoDismiss: 0,
  };
}

const missionCreateSuccessNotification = {
  title: '',
  message: 'Задание создано успешно.',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 5,
};

const missionsByCarAndDateUpdateNotification = {
  title: '',
  message: 'Список заданий обновлён.',
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 0,
};

const missionFuelRateByCarUpdateNotification = {
  title: '',
  message: 'Для выбранной марки/модели ТС нет данных по нормам расхода топлива',
  level: 'warning',
  dismissible: true,
  position: 'tr',
  autoDismiss: 0,
};

export const saveDataSuccessNotification = {
  title: '',
  message: 'Данные успешно сохранены.',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 5,
};

export const reassignMissionSuccessNotification = {
  title: '',
  message: 'Запись успешно сохранена.',
  level: 'success',
  dismissible: true,
  position: 'tc',
  autoDismiss: 5,
};

export const changeCompanyStructureIdNotyfication = {
  title: '',
  message: 'Обращаем Ваше внимание, что для корректной работы системы после изменения подразделения, соответствующие правки необходимо внести в маршрутах, шаблонах заданий и наряд-заданий, в которых использовался данный объект.',
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 0,
  uid: 'change_geoobject_company_structure_id',
};

export const changeEngineTypeIdsNotyfication = {
  title: '',
  message: 'При изменении типа двигателя изменятся доступные поля в путевом листе ТС',
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 0,
  uid: 'change_engine_type_ids',
};
export const changeEngineGasTypeNotyfication = {
  title: '',
  message: 'При изменении значения изменятся доступные поля в путевом листе ТС',
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 0,
  uid: 'change_engine_gas_type',
};

export const addParentCompanyStructureIdNotyfication = (dek, dey) => ({
  title: '',
  message: `Подразделение ${dek} добавлено автоматически, т.к. является родительским подразделением у ${dey}`,
  level: 'info',
  dismissible: true,
  position: 'tr',
  autoDismiss: 0,
  uid: 'add_parent_geoobject_company_structure_id',
});

export const notifications = {
  missionCreateSuccessNotification,
  missionFuelRateByCarUpdateNotification,
  missionsCreationSuccessNotification,
  missionsByCarAndDateUpdateNotification,
};

export function getWarningNotification(message) {
  return {
    title: 'Внимание!',
    level: 'warning',
    dismissible: true,
    position: 'tr',
    autoDismiss: 0,
    children: makeReactMessage(message),
  };
}

export function getErrorNotificationFromBack(message) {
  return {
    title: 'Внимание!',
    level: 'error',
    dismissible: true,
    position: 'tr',
    autoDismiss: 0,
    children: makeReactMessage(message),
  };
}

export function getInfoNotification(message) {
  return {
    title: 'Информация.',
    children: makeReactMessage(message),
    level: 'info',
    dismissible: true,
    position: 'tr',
    autoDismiss: 0,
  };
}

export function noItemsInfoNotification(msg = 'По данному запросу нет записей.') {
  global.NOTIFICATION_SYSTEM.notify(msg, 'info');
}

export function hasWarningNotification(response) {
  if (response.warnings) {
    if (Array.isArray(response.warnings)) {
      response.warnings.forEach((w) => {
        if (!w.hidden) {
          global.NOTIFICATION_SYSTEM.notify(getWarningNotification(w.message || w));
        }
      });
    } else if ((response.warnings && response.warnings.message) || typeof response.warnings === 'string') {
      if (!response.warnings.hidden) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification(response.warnings.message || response.warnings));
      }
    }
    return true;
  }

  return false;
}
