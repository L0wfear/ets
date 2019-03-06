import {
  incLoadingCount,
  decLoadingCount,
} from 'redux-main/_middleware/ets-loading/module/actions-loading';

const etsLoading = ({ dispatch }) => (next) => (action) => {
  const { meta = { promise: false, page: '', path: '' } } = action;

  if (meta.promise && typeof action.payload.then === 'function') {
    let countLoad = false;
    const interval = setTimeout(() => {
      countLoad = true;
      dispatch(incLoadingCount(meta));
    }, 300);

    return action.payload
      .then((result) => {
        if (countLoad) {
          dispatch(decLoadingCount(meta));
        } else {
          clearTimeout(interval);
        }
        if (action.type && action.type !== 'none') {
          return dispatch({
            ...action,
            payload: result,
          });
        }

        return {
          ...action,
          payload: result,
        };
      })
      .catch((error) => {
        if (countLoad) {
          dispatch(decLoadingCount(meta));
        } else {
          clearTimeout(interval);
        }
        throw error;
      });
  }

  return next(action);
};

export default etsLoading;
