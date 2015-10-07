import { Store } from 'flummox';

const defaultUser = {
  login: 'mayor',
  password: 'mayor',
  role: 'mayor'
};

class LoginStore extends Store {

  constructor(flux) {
    super();

    const loginActions = flux.getActions('login');
    this.register(loginActions.login, this.handleLogin);

    this.state = {
      currentUser: defaultUser //document.referrer.match(/^https?:\/\/monitor.mos.ru/) ? defaultUser : null
    };

  }

  handleLogin(currentUser) {
    this.setState({
      currentUser
    });
  }
}

export default LoginStore;
