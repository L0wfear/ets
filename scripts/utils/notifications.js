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
