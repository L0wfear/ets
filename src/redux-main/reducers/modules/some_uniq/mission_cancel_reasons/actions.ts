import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMissionCancelReasons } from 'redux-main/reducers/modules/some_uniq/mission_cancel_reasons/promise';

export const actionSetMissionCancelReasons = (
  missionCancelReasonsList: IStateSomeUniq['missionCancelReasonsList'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      missionCancelReasonsList,
    }),
  );
export const actionResetMissionCancelReasons: any = () => (dispatch) =>
  dispatch(actionSetMissionCancelReasons([]));
export const actionGetCompanyStructure: any = (
  payload = {},
  { page, path }: { page: string; path?: string },
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetMissionCancelReasons(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
export const actionGetAndSetInStoreMissionCancelReasons: any = (
  payload = {},
  { page, path }: { page?: string; path?: string },
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(actionGetCompanyStructure(payload, { page, path }));

  dispatch(actionSetMissionCancelReasons(data));

  return {
    driverList: data,
  };
};
