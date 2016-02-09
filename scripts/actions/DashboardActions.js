import { Actions } from 'flummox';
import { getEmployees, updateEmployee, getDashboardCurrentMissions, getDashboardFutureMissions, getDashboardCarInWork, getDashboardReleasedWaybill } from '../adapter.js';
import _ from 'lodash';

export default class DashboardActions extends Actions {

  getMasterComponents() {
    return getEmployees();
  }

  getDispatcherComponents() {
    return getEmployees();
  }

  getDashboardCurrentMissions() {
    return getDashboardCurrentMissions();
  }

  getDashboardFutureMissions() {
    return getDashboardFutureMissions();
  }

  getDashboardCarInWork() {
    return getDashboardCarInWork();
  }

  getDashboardReleasedWaybill() {
    return getDashboardReleasedWaybill();
  }

}
