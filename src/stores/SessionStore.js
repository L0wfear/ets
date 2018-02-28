import { Store } from 'flummox';
import moment from 'moment';

import { userNotification, getFullAccess } from 'api/mocks/permissions';
import { clear } from 'utils/cache';
import { setUserContext } from 'config/raven';
import { routToPer } from 'constants/routerAndPermission.ts';
import createFio from '../utils/create-fio.js';
import { User } from '../models';

const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor',
};

export const getSpecificPermissions = (user) => {
  const permissions = [];

  if (user.login === 'gormost') {
    permissions.push(...getFullAccess('bridges'));
    permissions.push(...getFullAccess('pedestrian_tunnels'));
    permissions.push(...getFullAccess('pedestrian_tunnel_exits'));
    permissions.push(...getFullAccess('fountains'));
  }
  /* DITETS-2080 */
  permissions.push(...getFullAccess('leak'));

  return permissions;
};

const getPermission = ({ permissions = [], permissionName, some = 1 }) => {
  if (!Array.isArray(permissionName)) {
    if (!some) {
      return permissions.includes(permissionName);
    }
    return permissions.some(p => p.includes(permissionName));
  }
  if (!some) {
    return !permissionName.some(pN => !permissions.some(p => p === pN));
  }
  return permissionName.some(pN => permissions.includes(pN));
};

export default class SessionStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;

    const sessionActions = flux.getActions('session');
    this.register(sessionActions.login, this.handleLogin);
    this.register(sessionActions.logout, this.handleLogout);


    let storedSession;
    let currentUser;

    try {
      storedSession = JSON.parse(localStorage.getItem(global.SESSION_KEY2));
      currentUser = JSON.parse(localStorage.getItem(global.CURRENT_USER2));
    } catch (e) {
      storedSession = null;
      currentUser = defaultUser;
    }

    currentUser = new User(currentUser);
    setUserContext(currentUser);

    this.state = {
      currentUser,
      isOkrug: currentUser.okrug_id !== null,
      session: storedSession,
      userPermissions: currentUser.permissions,
    };
  }
// TODO
  handleLogin(data) {
    clear();
    data.payload.fio = createFio(data.payload);
    const session = data.token;
    let currentUser = data.payload;

    // Здесь можно вставлять моковые пермишины
    currentUser.permissions = [
      ...currentUser.permissions,
      ...userNotification,
      ...getSpecificPermissions(currentUser),
    ];

    const routeVal = Object.entries(routToPer).reduce((obj, [key, rTp]) => {
      if (!obj.lvl || obj.lvl > rTp.lvl) {
        if (getPermission({ permissions: currentUser.permissions, permissionName: rTp.p, some: true })) {
          obj = {
            lvl: rTp.lvl,
            path: key,
          };
        }
      }
      return obj;
    }, {});
    currentUser.stableRedirect = routeVal.path;

    localStorage.setItem(global.SESSION_KEY2, JSON.stringify(session));
    localStorage.setItem(global.CURRENT_USER2, JSON.stringify(currentUser));
    this.flux.getStore('dashboard').resetState();
    this.flux.getStore('reports').resetState();
    setUserContext(currentUser);
    currentUser = new User(currentUser);
    this.setState({
      currentUser,
      session,
      isOkrug: data.payload.okrug_id !== null,
      userPermissions: currentUser.permissions,
    });
  }

  isLoggedIn() {
    return !!this.state.session;
  }

  handleLogout(message) {
    localStorage.removeItem(global.SESSION_KEY2);
    localStorage.removeItem(global.CURRENT_USER2);
    localStorage.removeItem(global.ERROR_GO_TO_ETS2);
    localStorage.removeItem(global.ERROR_IN_COD);

    this.setState({
      session: null,
      sessionError: message || null,
    });
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  getSession() {
    return this.state.session;
  }

  getPermission(permissionName, some = false) {
    const { permissions = [] } = this.state.currentUser;
    return getPermission({ permissions, permissionName, some });
  }
  getStableRedirect() {
    return this.state.currentUser.stableRedirect;
  }
  isSeeNotifyProblem() {
    if (moment(new Date()).diff(new Date(2018, 1, 27, 16, 0, 1), 'seconds') < 0) {
      const { isSee = false } = JSON.parse(localStorage.getItem(global.ERROR_IN_COD)) || {};
      if (!isSee) {
        return false;
      }
      return true;
    }
    this.setAsSee(false);
    return true;
  }
  setAsSee(flag) {
    localStorage.setItem(global.ERROR_IN_COD, JSON.stringify({ isSee: flag }));
  }

}
