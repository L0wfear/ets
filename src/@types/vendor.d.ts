/**
 * No import/export is allowed because global scope will be turned off.
 */

declare module NodeJS  {
  interface Global {
    NODE_ENV: string;
    NOTIFICATION_SYSTEM: {
      notify(text: string | object, type?: string, position?: string);
      removeNotification(uid: string | number),
    };
    SESSION_KEY2: string;
    window: any;
    APP_DATE_FORMAT: string;
    CURRENT_USER2: string;
    confirmDialog: any;
    NOTIFICATION_READ_ARR: string;
    APP_TIME_FORMAT: string;
  }
}

declare module '*.png';
declare module '*.mp3'
declare module '*.ogg'
declare module "*.svg" {
  const content: any;
  export default content;
}
