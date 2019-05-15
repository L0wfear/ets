import { Store } from 'flummox';

import { userNotification } from 'api/mocks/permissions';
import { setUserContext } from 'config/raven';
import { routToPer } from 'constants/routerAndPermission';
import { getWarningNotification } from 'utils/notifications';
import { withSpecificPermissions } from 'redux-main/reducers/modules/session/actions-session';
import createFio from '../utils/create-fio';
import { User } from '../models';

const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor',
};

const getPermission = ({ permissions = [], permissionName, some = 1 }) => {
  if (!Array.isArray(permissionName)) {
    if (!some) {
      return permissions.includes(permissionName);
    }
    return permissions.some((p) => p.includes(permissionName));
  }
  if (!some) {
    return !permissionName.some(pN => !permissions.some((p) => p === pN));
  }
  return permissionName.some(pN => permissions.includes(pN));
};

export default class SessionStore extends Store {
  constructor(flux) {
    super();
    this.flux = flux;

    const sessionActions = flux.getActions('session');
    this.register(sessionActions.login, this.handleLogin);
    this.register(sessionActions.cahngeCompanyOnAnother, this.handleLogin);
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
      isKgh: currentUser.permissions.includes('common.nsi_company_column_show'),
      session: storedSession,
      userPermissions: [
        ...currentUser.permissions,
        ...withSpecificPermissions(currentUser),
      ],
      isGlavControl: currentUser.permissions.includes('role.change'),
    };
  }

  // TODO
  handleLogin(data) {
    if (data && data.payload) {
      data.payload.fio = createFio(data.payload);
      const session = data.token;
      let currentUser = data.payload;

      // Здесь можно вставлять моковые пермишины
      currentUser.permissions = [
        ...currentUser.permissions,
        ...userNotification,
        ...withSpecificPermissions(currentUser),
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

      setUserContext(currentUser);
      currentUser = new User(currentUser);

      const newState = {
        currentUser,
        session,
        isOkrug: data.payload.okrug_id !== null,
        isKgh: currentUser.permissions.includes('common.nsi_company_column_show'),
        userPermissions: currentUser.permissions,
        isGlavControl: currentUser.permissions.includes('role.change'),
      };

      this.setState(newState);
    } else {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Произошла непредвиденная ошибка'));
    }
  }

  isLoggedIn() {
    return !!this.state.session;
  }

  handleLogout(message) {
    localStorage.removeItem(global.SESSION_KEY2);
    localStorage.removeItem(global.CURRENT_USER2);
    localStorage.removeItem(global.API__KEY2);

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
}
