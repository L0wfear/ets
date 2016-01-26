import { Actions } from 'flummox';
import { getEmployees, updateEmployee } from '../adapter.js';
import _ from 'lodash';
import moment from 'moment';

export default class EmployeesActions extends Actions {

  getEmployees() {
    return getEmployees();
  }

  updateEmployee(formState) {
    const payload = _.clone(formState);
    payload.birthday = moment(payload.birthday).format('DD.MM.YYYY');
    return updateEmployee(payload);
  }

}
