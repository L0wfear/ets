import { routToPer } from 'constants/routerAndPermission.ts';

export const requireAuth = flux => (nextState, replaceState) => {
  if (!flux.getStore('session').isLoggedIn() || !flux.getStore('session').getCurrentUser().role) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
    return;
  }
  if (routToPer[nextState.location.pathname]) {
    if (!flux.getStore('session').getPermission(routToPer[nextState.location.pathname].p, true)) {
      const sessionRedirect = flux.getStore('session').getStableRedirect();

      if (sessionRedirect && sessionRedirect !== '/login') {
        replaceState({ nextPathname: nextState.location.pathname }, sessionRedirect);
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
        replaceState({ nextPathname: nextState.location.pathname }, routeVal.path);
        return;
      }
    }
  }
};

export const checkLoggedIn = flux => (nextState, replaceState) => {
  const user = flux.getStore('session').getCurrentUser();
  const { role, okrug_id } = user;

  if (flux.getStore('session').isLoggedIn() && role) {
    if (['dispatcher', 'master'].indexOf(role) > -1 && okrug_id === null) {
      replaceState({}, '/dashboard');
    } else {
      replaceState({}, '/monitor');
    }
  } else if (nextState.location.pathname !== '/login') {
    replaceState({}, '/login');
  }
};
