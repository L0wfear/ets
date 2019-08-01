import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { MunicipalFacility } from './@types';

/* --------------- обновление стора --------------- */
export const actionSetMunicipalFacility = (municipalFacilityList: IStateSomeUniq['municipalFacilityList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      municipalFacilityList,
    }),
  )
);
export const actionSetMunicipalFacilityForMission = (municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      municipalFacilityForMissionList,
    }),
  )
);
export const actionSetMunicipalFacilityForDutyMission = (municipalFacilityForDutyMissionList: IStateSomeUniq['municipalFacilityForDutyMissionList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      municipalFacilityForDutyMissionList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetMunicipalFacility: any = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetMunicipalFacility([]),
  );

  return null;
};
export const actionResetMunicipalFacilityForMission: any = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetMunicipalFacilityForMission([]),
  );

  return null;
};
export const actionResetMunicipalFacilityForDutyMission: any = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetMunicipalFacilityForDutyMission([]),
  );

  return null;
};

/* --------------- запрос --------------- */
export const actionGetMunicipalFacility: any = (payload = {}, { page, path }: LoadingMeta) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetMunicipalFacility(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreMunicipalFacility: any = (payload = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetMunicipalFacility(payload, { page, path }),
  );

  dispatch(
    actionSetMunicipalFacility(data),
  );

  return {
    municipalFacilityList: data,
  };
};
export const actionGetAndSetInStoreMunicipalFacilityForMission: any = (payload = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetMunicipalFacility(
      {
        for: 'mission',
        ...payload,
      },
      { page, path }),
  );

  dispatch(
    actionSetMunicipalFacilityForMission(data),
  );

  return {
    municipalFacilityForMissionList: data,
  };
};

export type ActionGetAndSetInStoreMunicipalFacilityForDutyMissionAns = {
  municipalFacilityForDutyMissionList: MunicipalFacility[],
};
export const actionGetAndSetInStoreMunicipalFacilityForDutyMission = (payload = {}, { page, path }: LoadingMeta): EtsAction<Promise<ActionGetAndSetInStoreMunicipalFacilityForDutyMissionAns>> => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetMunicipalFacility(
      {
        for: 'duty-mission',
        ...payload,
      },
      { page, path }),
  );

  dispatch(
    actionSetMunicipalFacilityForDutyMission(data),
  );

  return {
    municipalFacilityForDutyMissionList: data,
  };
};

export default {
  actionSetMunicipalFacility,
  actionSetMunicipalFacilityForMission,
  actionSetMunicipalFacilityForDutyMission,
  actionResetMunicipalFacility,
  actionResetMunicipalFacilityForMission,
  actionResetMunicipalFacilityForDutyMission,
  actionGetMunicipalFacility,
  actionGetAndSetInStoreMunicipalFacility,
  actionGetAndSetInStoreMunicipalFacilityForMission,
  actionGetAndSetInStoreMunicipalFacilityForDutyMission,
};
