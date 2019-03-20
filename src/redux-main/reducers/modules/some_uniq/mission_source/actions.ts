import { get } from 'lodash';
import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';

const actionSetMissionSource = (missionSourceList: IStateSomeUniq['missionSource']['list']): ThunkAction<IStateSomeUniq['missionSource'], ReduxState, {}, AnyAction> => (dispatch) => {
  const missionSource = {
    list: missionSourceList,
    order_mission_source_id: get(missionSourceList.find(({ auto }) => auto), 'id', null),
  };

  dispatch(
    someUniqSetNewData({
      missionSource,
    }),
  );

  return missionSource;
};
const actionResetMissionSource = (): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionSetMissionSource>>, ReduxState, {}, AnyAction> => (dispatch) => {
  const response = dispatch(
    actionSetMissionSource([]),
  );

  return response;
};
const actionLoadMissionSource = (payloadOwn: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseGetMissionSource>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetMissionSource(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionGetAndSetInStoreMissionSource = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionLoadMissionSource>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionLoadMissionSource(payload, meta),
  );

  dispatch(
    actionSetMissionSource(response.data),
  );

  return response;
};

export default {
  actionSetMissionSource,
  actionResetMissionSource,
  actionLoadMissionSource,
  actionGetAndSetInStoreMissionSource,
};
