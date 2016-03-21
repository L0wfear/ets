import { Actions } from 'flummox';
import { logout } from '../adapter.js';
import _ from 'lodash';
import { AuthService } from 'api/Services';

export default class SessionActions extends Actions {

  login(user) {
    return AuthService.post(user, false, 'json');
  }

  logout() {
    return logout();
  }

}
