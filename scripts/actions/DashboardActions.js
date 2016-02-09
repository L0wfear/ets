import { Actions } from 'flummox';
import { getDashboardComponent } from '../adapter.js';
import _ from 'lodash';

export default class DashboardActions extends Actions {

  getDashboardComponent(role, key, id) {
    return getDashboardComponent(role, key, id);
  }

  getDashboardSideComponent(role, key, id) {
    return getDashboardComponent(role, key, id);
  }

}
