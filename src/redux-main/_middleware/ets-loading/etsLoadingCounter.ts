import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { incLoadingCount, decLoadingCount } from './module/actions-loading';

const etsLoadingCounter = async <PromiseAns>(dispatch: any, promise: Promise<PromiseAns>, meta: LoadingMeta) => {
  let countLoad = false;
  let interval = null;

  if (!meta.noTimout) {
    interval = setTimeout(() => {
      countLoad = true;
      dispatch(incLoadingCount(meta));
    }, 300);
  }

  let response: PromiseAns = null;

  try {
    response = await promise;
    if (countLoad || !meta.noTimout) {
      dispatch(decLoadingCount(meta));
    } else {
      clearTimeout(interval);
    }
  } catch (error) {
    if (countLoad || !meta.noTimout) {
      dispatch(decLoadingCount(meta));
    } else {
      clearTimeout(interval);
    }

    throw error;
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
