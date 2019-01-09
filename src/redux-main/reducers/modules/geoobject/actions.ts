import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

import carpoolActions from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/actions';

const geoobjectActions = {
  geoobjectSetNewData,
  ...carpoolActions,
};

export default geoobjectActions;
