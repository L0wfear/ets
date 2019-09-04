import { geoobjectSetNewData } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import {
  promiseUpdateDt,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/promise';
import { keyBy } from 'lodash';
import { defaultAction } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

import { defaultActions } from 'redux-main/default.actions';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';

const actionSetDt = (obj: { data: Dt[] }): EtsAction<EtsActionReturnType<typeof geoobjectSetNewData>> => (dispatch) => (
  dispatch(
    geoobjectSetNewData({
      dtList: obj.data,
      dtPolys: keyBy(obj.data, 'yard_id'),
    }),
  )
);
const actionUpdateDt = (payload: Parameters<typeof promiseUpdateDt>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateDt>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateDt(payload),
      meta,
    ),
  );
};

const actionsDt_default = defaultActions<Dt>(
  'geozones/dt',
  actionSetDt,
  makeShape,
);

export const actionsDt = {
  ...actionsDt_default,
  put: actionUpdateDt,
};
