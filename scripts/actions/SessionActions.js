import { Actions } from 'flummox';
import { login, logout } from '../adapter.js';
import _ from 'lodash';

export default class SessionActions extends Actions {

  login(user) {
    return login(user);
  }

  logout() {
    return logout();
  }

}
