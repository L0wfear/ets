import { routesSetNewData } from 'redux-main/reducers/modules/routes/common';

import * as routes from 'redux-main/reducers/modules/routes/routes/actions';

const routesActions = {
  routesSetNewData,
  ...routes,
};

export default routesActions;
