import { flux } from './../config/flux';

export function requireAuth(nextState, replaceState) {
  if (!flux.getStore('session').isLoggedIn() || !flux.getStore('session').getCurrentUser().role) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
    return;
  }
}

export function checkLoggedIn(nextState, replaceState) {
  const user = flux.getStore('session').getCurrentUser();
  const { role, okrug_id } = user;
  if (flux.getStore('session').isLoggedIn() && role) {
    if (['dispatcher', 'master'].indexOf(role) > -1 && okrug_id === null) {
      replaceState({}, '/dashboard');
    } else {
      replaceState({}, '/monitor');
    }
  }
}
