import { Store } from 'flummox';

const SESSION_KEY = 'ets-session';
const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor'
};

class SessionStore extends Store {

  constructor(flux) {
    super();
    console.log('SESSION STORE DID MOUNT');
    const sessionActions = flux.getActions('session');
    this.register(sessionActions.login, this.handleLogin);
    this.register(sessionActions.logout, this.handleLogout);



    let storedSession, currentUser;

    try {
      storedSession = JSON.parse(localStorage.getItem(SESSION_KEY));
      currentUser = JSON.parse(localStorage.getItem('current_user'));
    } catch(e) {
      storedSession = null;
      currentUser = defaultUser;
    }

    this.state = {
      currentUser,
      session: storedSession
    };

  }

  handleLogin(data) {
    const session = data.token;
    const currentUser = data.payload;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('current_user', JSON.stringify(currentUser));
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
