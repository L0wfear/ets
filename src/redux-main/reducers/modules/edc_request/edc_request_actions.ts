import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { HandleThunkActionCreator } from 'react-redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { promiseLOadEdcRequesById } from './edc_request_promise';

const actionLoadEdcRequestById = (id: number, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseLOadEdcRequesById>>, ReduxState, {}, AnyAction> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLOadEdcRequesById(
      id,
    ),
    meta,
  );
};

const edcRequestActions = {
  actionLoadEdcRequestById,
};

export default edcRequestActions;
