import { routToPer } from 'constants/routerAndPermission.ts';

const isPermittedRoute = ({ match, history, flux }) => {
};

/*
export const requireAuth = flux => (nextState, replaceState) => {
  if (!flux.getStore('session').isLoggedIn() || !flux.getStore('session').getCurrentUser().role) {
    replaceState({ nextPathname: nextState.match.url }, '/login');
    return;
  }
  if (routToPer[nextState.match.url]) {
    if (!flux.getStore('session').getPermission(routToPer[nextState.match.url].p, true)) {
      const sessionRedirect = flux.getStore('session').getStableRedirect();

      if (sessionRedirect && sessionRedirect !== '/login') {
        replaceState({ nextPathname: nextState.match.url }, sessionRedirect);
        return;
      }
      const routeVal = Object.entries(routToPer).reduce((obj, [key, rTp]) => {
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

      if (routeVal) {
        replaceState({ nextPathname: nextState.match.url }, routeVal.path);
        return;
      }
    }
  }
};
*/

export default isPermittedRoute;
