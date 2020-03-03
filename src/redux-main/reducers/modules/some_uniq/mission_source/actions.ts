import { get } from 'lodash';
import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';

const actionSetMissionSource = (missionSourceList: IStateSomeUniq['missionSource']['list']): EtsAction<IStateSomeUniq['missionSource']> => (dispatch) => {
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
const actionResetMissionSource = (): EtsAction<EtsActionReturnType<typeof actionSetMissionSource>> => (dispatch) => {
  const response = dispatch(
    actionSetMissionSource([]),
  );

  return response;
};
const actionLoadMissionSource = (payloadOwn: object, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMissionSource>> => async (dispatch) => {
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
const actionGetAndSetInStoreMissionSource = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionLoadMissionSource>> => async (dispatch) => {
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
