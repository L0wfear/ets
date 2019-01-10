import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';

import carpoolActions from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/actions';
import dtActions from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/actions';
import odhActions from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/actions';

const geoobjectActions = {
  geoobjectSetNewData,
  ...carpoolActions,
  ...dtActions,
  ...odhActions,
};

export default geoobjectActions;
