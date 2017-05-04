/**
 * No import/export is allowed because global scope will be turned off.
 */

declare module NodeJS  {
  interface Global {
    NOTIFICATION_SYSTEM: {
      notify(text: string | object, type?: string, position?: string);
    };
  }
}