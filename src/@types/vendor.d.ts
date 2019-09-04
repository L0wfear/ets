/**
 * No import/export is allowed because global scope will be turned off.
 */

 type ConfirmDialogProps = {
  title?: string | any;
  body?: any;
  okName?: string;
  cancelName?: string;
  bsSize?: 'small',
  defaultState?: object,
  checkOnOk?: (...arg: any[]) => boolean,
 };

 type NOTIFICATION_SYSTEM_NOTIFY_TYPE = 'success' | 'error' | 'warning' | 'info' | string;
 type NOTIFICATION_SYSTEM_NOTIFY_POSITION = 'tc' | 'tr' | string;

 type NOTIFICATION_SYSTEM_NOTIFY_AS_OBJECT = {
  title?: string;
  children?: React.ReactNode;
  message?: React.ReactNode;
  uid?: string | number;
  level?: NOTIFICATION_SYSTEM_NOTIFY_TYPE;
  dismissible?: boolean;
  position?: NOTIFICATION_SYSTEM_NOTIFY_POSITION;
  autoDismiss?: number,
  action?: {
    label: string;
    callback: () => any;
  };
};

 type NOTIFICATION_SYSTEM_NOTIFY = (
  text: string | NOTIFICATION_SYSTEM_NOTIFY_AS_OBJECT,
  type?: NOTIFICATION_SYSTEM_NOTIFY_TYPE,
  position?: NOTIFICATION_SYSTEM_NOTIFY_POSITION,
) => void;

 declare namespace NodeJS {
  interface Global {
    NODE_ENV: string;
    NOTIFICATION_SYSTEM: {
      notify: NOTIFICATION_SYSTEM_NOTIFY
      notifyWithObject: (obj: NOTIFICATION_SYSTEM_NOTIFY_AS_OBJECT) => void;
      removeNotification: (uid: string | number) => void;
    };
    SESSION_KEY: string;
    SESSION_KEY_ETS_TEST_BY_DEV: string;
    API__KEY: string;
    window: any;
    APP_DATE_FORMAT: string;
    NOTIFICATION_READ_ARR: string;
    APP_TIME_FORMAT: string;
    APP_TIME_WITH_SECOND_FORMAT: string;
    toggleUpdateCarPoints: any;
    confirmDialog: (props: ConfirmDialogProps) => Promise<any>;
    makeReactSelectMenuOpen?: (key: string) => void;
    test: any;
  }
}

 declare const __CLIENT__: boolean;
 declare const __SERVER__: boolean;
 declare const __DEVELOPMENT__: boolean;

 declare module '*.png';
 declare module '*.mp3';
 declare module '*.ogg';
 declare module '*.svg' {
  const content: any;
  export default content;
}

// typings/custom.d.ts
 declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
