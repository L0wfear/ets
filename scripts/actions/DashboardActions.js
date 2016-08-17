import { Actions } from 'flummox';
import { getDashboardComponent } from '../adapter.js';
import _ from 'lodash';
import moment from 'moment';

export default class DashboardActions extends Actions {

  getDashboardComponent(key) {
    let payload = {};
    if (key === 'faxogramms') {
      payload = Object.assign(payload, {status: 2, date: moment().format('YYYY-MM-DDTHH:mm:ss')});
    }
    return getDashboardComponent(key, payload);
  }

}
