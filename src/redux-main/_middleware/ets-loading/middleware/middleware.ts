import {
  incLoadingCount,
  decLoadingCount,
} from 'redux-main/_middleware/ets-loading/module/actions-loading';

const etsLoading = ({ dispatch }) => (next) => (action) => {
  const { meta = { promise: false, page: '', path: '' } } = action;

  if (meta.promise && typeof action.payload.then === 'function') {
    dispatch(incLoadingCount(meta));

    return action.payload
      .then((result) => {
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
        throw error;
      })
      .finally(() => {
        dispatch(decLoadingCount(meta));
      });
  }

  return next(action);
};

export default etsLoading;
