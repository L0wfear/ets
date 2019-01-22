import { routToPer } from 'constants/routerAndPermission';
import { isArray } from 'util';

export const isPermitted = (permissionsSet, permissionName) => {
  if (!isArray(permissionName)) {
    return permissionsSet.has(permissionName);
  }
  return permissionName.some((pN) => permissionsSet.has(pN));
};

const requireAuth = (permissionsSet, url) => {
  if (routToPer[url]) {
    if (!isPermitted(permissionsSet, routToPer[url].p)) {
      const routeVal = Object.entries(routToPer).reduce((obj: any, [key, rTp]) => {
        if (!obj.lvl || obj.lvl > rTp.lvl) {
          if (isPermitted(permissionsSet, rTp.p)) {
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
