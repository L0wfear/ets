import { pathToRegexp } from 'path-to-regexp';

import { routToPer } from 'constants/routerAndPermission';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

const requireAuth = (permissionsSet: InitialStateSession['userData']['permissionsSet'], url: string) => {
  const somePageData = Object.entries(routToPer).find(([routePath]) => {
    try {
      const re = pathToRegexp(routePath, []);
      return re.exec(url);
    } catch {
      return false;
    }
  });

  if (somePageData) {
    const someRouteData: any = somePageData[1];
    if (!validatePermissions(someRouteData.p, permissionsSet)) {
      const routeVal = Object.entries(routToPer).reduce((obj: any, [key, rTp]: any) => {
        if (!obj.lvl || obj.lvl > rTp.lvl) {
          if (validatePermissions(rTp.p, permissionsSet)) {
            return {
              lvl: rTp.lvl,
              path: key,
            };
          }
        }
        return obj;
      }, {});

      return routeVal ? routeVal.path.replace(/\/:\w+\?/g, '') : url;
    }
  }
  return url;
};

export default requireAuth;
