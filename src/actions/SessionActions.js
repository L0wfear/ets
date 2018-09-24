import { Actions } from 'flummox';
import {
  AuthService,
  ChangeRole,
} from 'api/Services';

export default class SessionActions extends Actions {
  login(user) {
    return AuthService.post(user, false, 'json');
  }

  cahngeCompanyOnAnother(company_id) {
    const payload = {};
    if (company_id) {
      payload.company_id = company_id;
    }
    return ChangeRole.post({ company_id }, false, 'json');
  }

  logout() {
    return new Promise(res => res());
  }
}
