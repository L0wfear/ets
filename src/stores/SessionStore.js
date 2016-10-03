import { Store } from 'flummox';
import { setUserContext } from 'config/raven';
import createFio from '../utils/create-fio.js';
import { User } from '../models';
import { clear } from 'utils/cache';

const SESSION_KEY = 'ets-session';
const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor',
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
      storedSession = JSON.parse(localStorage.getItem(SESSION_KEY));
      currentUser = JSON.parse(localStorage.getItem('current_user'));
    } catch (e) {
      storedSession = null;
      currentUser = defaultUser;
    }

    currentUser = new User(currentUser);
    setUserContext(currentUser);

    this.state = {
      currentUser,
      session: storedSession,
      userPermissions: currentUser.permissions,
    };
  }

  handleLogin(data) {
    clear();
    data.payload.fio = createFio(data.payload);
    const session = data.token;
    let currentUser = data.payload;

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    this.flux.getStore('dashboard').resetState();
    setUserContext(currentUser);
    currentUser = new User(currentUser);
    this.setState({
      currentUser,
      session,
      userPermissions: currentUser.permissions,
    });
  }

  isLoggedIn() {
    return !!this.state.session;
  }

  handleLogout(message) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('current_user');
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
    const { permissions } = this.state.currentUser;
    if (Array.isArray(permissionName)) {
      permissionName.forEach((permission) => {
        if (permissions.indexOf(permission) === -1) return false;
      });
      return true;
    }

    return !!(permissions.indexOf(permissionName) + 1);
  }

}
