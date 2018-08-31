/**
 * No import/export is allowed because global scope will be turned off.
 */

declare module NodeJS  {
  interface Global {
    NOTIFICATION_SYSTEM: {
      notify(text: string | object, type?: string, position?: string);
      removeNotification(uid: string | number),
    };
    SESSION_KEY: string;
    window: any;
    APP_DATE_FORMAT: string;
    APP_TIME_FORMAT: string;
    APP_TIME_WITH_SECOND_FORMAT: string;
    toggleUpdateCarPoints: Function;
    confirmDialog: (props: any) => Promise<any>;
  }
}

declare module "*.svg" {
  const content: any;
  export default content;
}