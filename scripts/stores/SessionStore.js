import { Store } from 'flummox';

const SESSION_KEY = 'ets-session';
const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor'
};

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

class User {
  constructor(user = {}) {
    if (user === null) user = {};
    this.company_id = user.company_id;
    this.company_name = user.company_name;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.middle_name = user.middle_name;
    this.login = user.login;
    this.role = user.role;
    this.user_id = user.user_id;
    this.structure_id = user.structure_id;
    this.map_config = user.map_config;
    this.fio = user.fio;
  }

  getCompanyMapConfig = () => {
    if (typeof this.map_config !== 'undefined' && this.map_config.zoom && this.map_config.coordinates) {
      return this.map_config;
    } else {
      return {
        coordinates: MAP_INITIAL_CENTER,
        zoom: MAP_INITIAL_ZOOM
      }
    }
  }
}

class SessionStore extends Store {

  constructor(flux) {
    super();
    const sessionActions = flux.getActions('session');
    const pointsActions = flux.getActions('points');
    this.flux = flux;
    this.register(sessionActions.login, this.handleLogin);
    this.register(sessionActions.logout, this.handleLogout);


    let storedSession;
    let currentUser;

    try {
      storedSession = JSON.parse(localStorage.getItem(SESSION_KEY));
      currentUser = JSON.parse(localStorage.getItem('current_user'));

      //pointsActions.setFilter({owner: [currentUser.company_id]});
    } catch (e) {
      storedSession = null;
      currentUser = defaultUser;
    }

    currentUser = new User(currentUser);

    this.state = {
      currentUser,
      session: storedSession
    };

  }

  handleLogin(data) {
    data.payload.fio = `${data.payload.last_name} ${data.payload.first_name[0]}. ${data.payload.middle_name[0]}.`;
    const session = data.token;
    let currentUser = data.payload;

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('current_user', JSON.stringify(currentUser));
    this.flux.getStore('dashboard').resetState();
    currentUser = new User(currentUser);
    this.setState({
      currentUser, session
    });
  }

  isLoggedIn() {
    return !!this.state.session;
  }

  handleLogout(message) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('current_user');
    this.setState({session: null, sessionError: message || null});
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  getSession() {
    return this.state.session;
  }

}

export default SessionStore;
