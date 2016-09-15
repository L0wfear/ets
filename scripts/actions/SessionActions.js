import { Actions } from 'flummox';
import {
  AuthService,
} from 'api/Services';

export default class SessionActions extends Actions {

  login(user) {
    return AuthService.post(user, false, 'json');
  }

  logout() {
    return new Promise(res => res());
  }

}
