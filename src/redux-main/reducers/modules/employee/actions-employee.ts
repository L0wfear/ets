import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';

import * as driver from 'redux-main/reducers/modules/employee/driver/actions';
import * as employee from 'redux-main/reducers/modules/employee/employee/actions';
import * as position from 'redux-main/reducers/modules/employee/position/actions';
import * as last_brigade from 'redux-main/reducers/modules/employee/last_brigade/actions';

const employeeActions = {
  employeeSetNewData,
  ...driver,
  ...employee,
  ...position,
  ...last_brigade,
};

export default employeeActions;
