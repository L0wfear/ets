import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetGeozoneMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import * as someUniq from 'redux-main/reducers/modules/some_uniq/some_uniq';
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
export const actionResetGeozoneMunicipalFacility: any = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetGeozoneMunicipalFacility(
      someUniq.initialState.geozoneMunicipalFacility,
    ),
  );

  return null;
};

/* --------------- запрос --------------- */
export const actionGetGeozoneMunicipalFacility: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetGeozoneMunicipalFacility(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreGeozoneMunicipalFacility: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(
    actionGetGeozoneMunicipalFacility(payload, { page, path }),
  );

  dispatch(actionSetGeozoneMunicipalFacility(data));

  return {
    geozoneMunicipalFacility: {
      ...data,
    },
  };
};

export default {
  actionSetGeozoneMunicipalFacility,
  actionResetGeozoneMunicipalFacility,
  actionGetGeozoneMunicipalFacility,
  actionGetAndSetInStoreGeozoneMunicipalFacility,
};
