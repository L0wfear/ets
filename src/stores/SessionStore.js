import { Store } from 'flummox';
import moment from 'moment';

import { autobase, userNotification, getFullAccess } from 'api/mocks/permissions';
import { clear } from 'utils/cache';
import { setUserContext } from 'config/raven';
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

  return permissions;
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
      storedSession = JSON.parse(localStorage.getItem(global.SESSION_KEY));
      currentUser = JSON.parse(localStorage.getItem(global.CURRENT_USER));
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
      ...autobase,
      ...userNotification,
      ...getSpecificPermissions(currentUser),
    ];

    localStorage.setItem(global.SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(global.CURRENT_USER, JSON.stringify(currentUser));
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
    localStorage.removeItem(global.SESSION_KEY);
    localStorage.removeItem(global.CURRENT_USER);
    localStorage.removeItem(global.ERROR_ASUODS);

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

  getPermission(permissionName) {
    const { permissions = [] } = this.state.currentUser;

    if (!Array.isArray(permissionName)) {
      return permissions.includes(permissionName);
    }
    const permissionsReduce = permissions.reduce(
      (obj, onePermission) => {
        obj[onePermission] = onePermission;
        return obj;
      },
      {},
    );

    return permissionName.reduce((bool, permission) => bool && !!permissionsReduce[permission], true);
  }

  isSeeNotifyProblem() {
    if (moment(new Date()).diff(new Date(2018, 0, 19, 14, 31, 0), 'seconds') < 0) {
      const { isSee = false } = JSON.parse(localStorage.getItem(global.ERROR_ASUODS)) || {};
      if (!isSee) {
        return false;
      }
      return true;
    }
    this.setAsSee();
    return true;
  }
  setAsSee() {
    localStorage.setItem(global.ERROR_ASUODS, JSON.stringify({ isSee: true }));
  }
}
