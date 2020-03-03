import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetGeozoneMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import * as someUniq from 'redux-main/reducers/modules/some_uniq/some_uniq';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
/* --------------- обновление стора --------------- */
export const actionSetGeozoneMunicipalFacility = (
  geozoneMunicipalFacility: IStateSomeUniq['geozoneMunicipalFacility'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      geozoneMunicipalFacility,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetGeozoneMunicipalFacility = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetGeozoneMunicipalFacility(
      someUniq.initialState.geozoneMunicipalFacility,
    ),
  );

  return;
};

/* --------------- запрос --------------- */
export const actionGetGeozoneMunicipalFacility = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetGeozoneMunicipalFacility>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetGeozoneMunicipalFacility(payload),
    meta,
  );
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreGeozoneMunicipalFacility = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetGeozoneMunicipalFacility>> => async (dispatch) => {
  const result = await dispatch(actionGetGeozoneMunicipalFacility(payload, meta));

  dispatch(actionSetGeozoneMunicipalFacility(result.data));

  return result;
};
