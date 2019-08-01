import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetSensorType } from 'redux-main/reducers/modules/some_uniq/sensor_type/sensor_type_promise';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { SensorType } from './@types/sensor_type';

export const actionSetSensorType = (sensorTypeList: IStateSomeUniq['sensorTypeList']): EtsAction<IStateSomeUniq['sensorTypeList']> => (dispatch) => {
  dispatch(
    someUniqSetNewData({
      sensorTypeList,
    }),
  );

  return sensorTypeList;
};
export const actionResetSensorType = (): EtsAction<IStateSomeUniq['sensorTypeList']> => (dispatch) => {
  const sensorTypeList = dispatch(
    actionSetSensorType([]),
  );

  return sensorTypeList;
};

export const actionGetSensorType = (payload: any, meta: LoadingMeta): EtsAction<Promise<SensorType[]>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseGetSensorType(payload),
    meta,
  );

  return response;
};

export const actionGetAndSetInStoreSensorType = (payloadOwn: object, meta: LoadingMeta): EtsAction<Promise<SensorType[]>> => async (dispatch) => {
  const sensorTypeList = await dispatch(
    actionGetSensorType(payloadOwn, meta),
  );

  dispatch(
    actionSetSensorType(sensorTypeList),
  );

  return sensorTypeList;
};
