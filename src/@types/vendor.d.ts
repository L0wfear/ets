/**
 * No import/export is allowed because global scope will be turned off.
 */

declare namespace NodeJS {
  interface Global {
    NODE_ENV: string;
    NOTIFICATION_SYSTEM: {
      notify(text: string | object, type?: string, position?: string);
      removeNotification(uid: string | number);
    };
    SESSION_KEY2: string;
    SESSION_KEY_ETS_TEST_BY_DEV2: string;
    API__KEY2: string;
    window: any;
    APP_DATE_FORMAT: string;
    NOTIFICATION_READ_ARR: string;
    APP_TIME_FORMAT: string;
    APP_TIME_WITH_SECOND_FORMAT: string;
    toggleUpdateCarPoints: any;
    confirmDialog: (props: any) => Promise<any>;
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
