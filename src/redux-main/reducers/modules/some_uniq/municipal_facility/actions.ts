import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetMunicipalFacility = (municipalFacilityList: IStateSomeUniq['municipalFacilityList']): EtsAction<void> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      municipalFacilityList,
    }),
  );
};
export const actionSetMunicipalFacilityForMission = (municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList']): EtsAction<void> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      municipalFacilityForMissionList,
    }),
  );
};
export const actionSetMunicipalFacilityForDutyMission = (municipalFacilityForDutyMissionList: IStateSomeUniq['municipalFacilityForDutyMissionList']): EtsAction<void> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      municipalFacilityForDutyMissionList,
    }),
  );
};

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
export const actionGetMunicipalFacility = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMunicipalFacility>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetMunicipalFacility(payload),
    {
      page,
      path,
    },
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreMunicipalFacility = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMunicipalFacility>> => async (dispatch) => {
  const data = await dispatch(
    actionGetMunicipalFacility(payload, { page, path }),
  );

  dispatch(
    actionSetMunicipalFacility(data),
  );

  return data;
};
export const actionGetAndSetInStoreMunicipalFacilityForMission = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMunicipalFacility>> => async (dispatch) => {
  const data = await dispatch(
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

  return data;
};

export const actionGetAndSetInStoreMunicipalFacilityForDutyMission = (payload = {}, { page, path }: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMunicipalFacility>> => async (dispatch) => {
  const data = await dispatch(
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

  return data;
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
