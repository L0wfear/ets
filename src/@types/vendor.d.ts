/**
 * No import/export is allowed because global scope will be turned off.
 */

declare module NodeJS  {
  interface Global {
    NODE_ENV: string;
    NOTIFICATION_SYSTEM: {
      notify(text: string | object, type?: string, position?: string);
    };
    SESSION_KEY2: string;
    window: any;
    APP_DATE_FORMAT: string;
    CURRENT_USER: string;
    NOTIFICATION_READ_ARR: string;
  }
}
