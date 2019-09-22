import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseLoadStateProgramStatus } from './promise_state_program_status';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionLoadStateProgramStatus = (payload: any, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseLoadStateProgramStatus>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseLoadStateProgramStatus(payload),
    meta,
  );

  return response;
};
