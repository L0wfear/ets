import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { incLoadingCount, decLoadingCount } from './module/actions-loading';

const etsLoadingCounter = async <PromiseAns>(dispatch: any, promise: Promise<PromiseAns>, meta: LoadingMeta) => {
  let countLoad = false;
  let interval = null;

  if (dispatch) {
    if (!meta.noTimeout) {
      interval = setTimeout(() => {
        countLoad = true;
        dispatch(incLoadingCount(meta));
      }, 300);
    } else {
      countLoad = true;
      dispatch(incLoadingCount(meta));
    }
  }

  let response: PromiseAns = null;
  let errorData = null;
  try {
    response = await promise;
  } catch (error) {
    errorData = error;
  }

  if (dispatch) {
    if (countLoad) {
      setTimeout(
        () => {
          dispatch(decLoadingCount(meta));
        },
        100,
      );
    } else {
      clearTimeout(interval);
    }
  }

  if (errorData) {
    throw errorData;
  }

  return response;
};

export const actionFetchWithCount: any = (promise: Promise<any>, meta: LoadingMeta) => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promise,
    meta,
  );
};

export default etsLoadingCounter;
