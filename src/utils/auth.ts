import { routToPer } from 'constants/routerAndPermission';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

const requireAuth = (permissionsSet: InitialStateSession['userData']['permissionsSet'], url: string) => {
  if (routToPer[url]) {
    if (!validatePermissions(routToPer[url].p, permissionsSet)) {
      const routeVal = Object.entries(routToPer).reduce((obj: any, [key, rTp]) => {
        if (!obj.lvl || obj.lvl > rTp.lvl) {
          if (validatePermissions(rTp.p, permissionsSet)) {
            obj = {
              lvl: rTp.lvl,
              path: key,
            };
          }
        }
        return obj;
      }, {});

      return routeVal.path || url;
    }
  }
  return url;
};

export default requireAuth;
