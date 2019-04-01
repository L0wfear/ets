import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetSensorType } from 'redux-main/reducers/modules/some_uniq/sensor_type/sensor_type_promise';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { SensorType } from './@types/sensor_type';

export const actionSetSensorType = (sensorTypeList: IStateSomeUniq['sensorTypeList']): ThunkAction<IStateSomeUniq['sensorTypeList'], ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      sensorTypeList,
    }),
  );

  return sensorTypeList;
};
export const actionResetSensorType = (): ThunkAction<IStateSomeUniq['sensorTypeList'], ReduxState, {}, AnyAction> => (dispatch) => {
  const sensorTypeList = dispatch(
    actionSetSensorType([]),
  );

  return sensorTypeList;
};

export const actionGetSensorType = (payload: any, meta: LoadingMeta): ThunkAction<Promise<SensorType[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetSensorType(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreSensorType = (payloadOwn: object, meta: LoadingMeta): ThunkAction<Promise<SensorType[]>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const sensorTypeList = await dispatch(
    actionGetSensorType(payloadOwn, meta),
  );

  dispatch(
    actionSetSensorType(sensorTypeList),
  );

  return sensorTypeList;
};
