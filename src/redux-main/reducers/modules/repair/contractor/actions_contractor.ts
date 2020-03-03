import { Contractor } from './@types/contractor';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseCreateContractor, promiseUpdateContractor } from './promise_contractor';

export const actionCreateContractor = (contractorNew: Contractor, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateContractor>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateContractor(contractorNew),
    meta,
  );

  return response;
};

export const actionUpdateContractor = (contractorNew: Contractor, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateContractor>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateContractor(contractorNew),
    meta,
  );

  return response;
};
