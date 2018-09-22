import { routToPer } from 'constants/routerAndPermission';

const requireAuth = (flux, url) => {
  if (routToPer[url]) {
    if (!flux.getStore('session').getPermission(routToPer[url].p, true)) {
      const routeVal = Object.entries(routToPer).reduce((obj: any, [key, rTp]) => {
        if (!obj.lvl || obj.lvl > rTp.lvl) {
          if (flux.getStore('session').getPermission(rTp.p, true)) {
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
