import { employeeSetNewData } from 'redux-main/reducers/modules/employee/common';

import * as driver from 'redux-main/reducers/modules/employee/driver/actions';

export default {
  employeeSetNewData,
  ...driver,
};
