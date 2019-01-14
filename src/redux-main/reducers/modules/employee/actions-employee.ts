import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';

import * as driver from 'redux-main/reducers/modules/employee/driver/actions';
import * as employee from 'redux-main/reducers/modules/employee/employee/actions';
import * as position from 'redux-main/reducers/modules/employee/position/actions';

export default {
  employeeSetNewData,
  ...driver,
  ...employee,
  ...position,
};
