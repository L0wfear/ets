import { isBoolean, isString } from 'util';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export const validatePermissions = (permissions: string | string[] | boolean, permissionsSet: InitialStateSession['userData']['permissionsSet']) => {
  if (isBoolean(permissions)) {
    return permissions;
  }
  if (isString(permissions)) {
    return permissionsSet.has(permissions);
  }

  return permissions.some((permission) => (
    isBoolean(permission) ? permission : permissionsSet.has(permission)
  ));
};
