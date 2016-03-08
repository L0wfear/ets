import { Actions } from 'flummox';
import { getDashboardComponent } from '../adapter.js';
import _ from 'lodash';

export default class DashboardActions extends Actions {

  getDashboardComponent(key) {
    return getDashboardComponent(key);
  }

  getDashboardSideComponent(key) {
    return getDashboardComponent(key);
  }

}
