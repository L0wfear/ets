import { promiseGetTrackSensor } from 'redux-main/reducers/modules/some_uniq/sensor_dut/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

/* --------------- запрос --------------- */
export const actionGetTrackSensor = (payload: Parameters<typeof promiseGetTrackSensor>[0],  meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetTrackSensor>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetTrackSensor(payload),
    meta,
  );
};
