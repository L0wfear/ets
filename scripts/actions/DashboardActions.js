import { Actions } from 'flummox';
import _ from 'lodash';
import moment from 'moment';
import {
  DashboardService
} from 'api/Services';

export default class DashboardActions extends Actions {

  getDashboardComponent(key) {
    let payload = {};
    if (key === 'faxogramms') {
      payload = Object.assign(payload, {
        status: 2,
        date: moment().format('YYYY-MM-DDTHH:mm:ss')
      });
    }
    if (key.indexOf('waybill_') > -1) {
      let path = key.replace(/_/g, "/");
      return DashboardService
        .path(path)
        .get(payload)
        .then(component => ({component, key}));
    }
    return DashboardService
      .path(key)
      .get(payload)
      .then(component => ({component, key}));
  }

}
