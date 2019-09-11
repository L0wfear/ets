import { isBoolean, isString, isArray } from 'util';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

export const validatePermissions = (permissions: string | boolean | Array<string | boolean>, permissionsSet: InitialStateSession['userData']['permissionsSet']) => {
  if (isBoolean(permissions)) {
    return permissions;
  }
  if (isString(permissions)) {
    return permissionsSet.has(permissions);
  }

  if (isArray(permissions)) {
    return permissions.some((permission) => (
      isBoolean(permission) ? permission : permissionsSet.has(permission)
    ));
  }

  return true;
};
