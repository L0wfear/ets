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

export function getErrorNotification(error) {
  return {
    title: 'Упс, что-то пошло не так',
    message: 'Ошибка инициализации приложения: не удалось загрузить справочники (' + error + ')',
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
