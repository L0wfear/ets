import { geoobjectSetNewDataNew } from 'redux-main/reducers/modules/geoobject/actions_by_type/common';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import {
  promiseUpdateOdh,
} from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/promise';
import { defaultAction, defaultActions } from 'redux-main/default.actions';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { makeShape } from 'redux-main/reducers/modules/geoobject/promises';

const actionUpdateOdh = (payload: Parameters<typeof promiseUpdateOdh>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateOdh>> => async (dispatch) => {
  return dispatch(
    defaultAction(
      promiseUpdateOdh(payload),
      meta,
    ),
  );
};

const actionsOdh_default = defaultActions<Odh>(
  'geozones/odh',
  geoobjectSetNewDataNew('odhList'),
  makeShape,
);

export const actionsOdh = {
  ...actionsOdh_default,
  put: actionUpdateOdh,
};
