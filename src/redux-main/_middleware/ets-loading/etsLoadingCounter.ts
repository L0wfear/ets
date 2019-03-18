import { LoadingMeta } from '../@types/ets_loading.h';
import { incLoadingCount, decLoadingCount } from './module/actions-loading';

const etsLoadingCounter = async <PromiseAns>(dispatch: any, promise: Promise<PromiseAns>, meta: LoadingMeta) => {
  let countLoad = false;

  const interval = setTimeout(() => {
    countLoad = true;
    dispatch(incLoadingCount(meta));
  }, 300);

  let response: PromiseAns = null;

  try {
    response = await promise;
    if (countLoad) {
      dispatch(decLoadingCount(meta));
    } else {
      clearTimeout(interval);
    }
  } catch (error) {
    if (countLoad) {
      dispatch(decLoadingCount(meta));
    } else {
      clearTimeout(interval);
    }

    throw error;
  }

  return response;
};

export default etsLoadingCounter;
