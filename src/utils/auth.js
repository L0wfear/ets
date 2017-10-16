import { routToPer } from 'constants/routerAndPermission.ts';

export const requireAuth = flux => (nextState, replaceState) => {
  console.log('requireAuth', nexttate.location.pathname )
  
  if (!flux.getStore('session').isLoggedIn() || !flux.getStore('session').getCurrentUser().role) {
    console.log('requireAuth', 'iAmNotLogined' nexttate.location.pathname )
  
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
    return;
  }
  console.log('requireAuth', 'iAmLogined' nexttate.location.pathname )
  
  if (routToPer[nextState.location.pathname]) {
    console.log('requireAuth secondIf', routToPer[nextState.location.pathname], nexttate.location.pathname )
    
    if (!flux.getStore('session').getPermission(routToPer[nextState.location.pathname].p, true)) {
      console.log('requireAuth thirdIf', flux.getStore('session').getPermission(routToPer[nextState.location.pathname].p, true), nexttate.location.pathname )
    
      const sessionRedirect = flux.getStore('session').getStableRedirect();
      console.log(sessionRedirect)
      if (sessionRedirect) {
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
      console.log(routeVal.path)
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
  console.log('checkLoggedIn', nexttate.location.pathname )
  if (flux.getStore('session').isLoggedIn() && role) {
    console.log('checkLoggedIn', 'iAmIsLogined', nexttate.location.pathname )
  
    if (['dispatcher', 'master'].indexOf(role) > -1 && okrug_id === null) {
      replaceState({}, '/dashboard');
    } else {
      replaceState({}, '/monitor');
    }
  } else if (nextState.location.pathname !== '/login') {
    replaceState({}, '/login');
  }
};
