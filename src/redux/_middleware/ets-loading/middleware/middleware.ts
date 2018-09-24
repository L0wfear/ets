import {
  incLoadingCount,
  decLoadingCount,
} from 'redux/_middleware/ets-loading/module/actions-loading';

const etsLoading = ({ dispatch }) => (next) => (action) => {
  const { meta = { promise: false, page: '', path: '' } } = action;

  if (meta.promise && typeof action.payload.then === 'function') {
    dispatch(incLoadingCount(meta));
    console.log(action.payload)
    return {
      ...action,
      payload: action.payload
        .then((result) => {
          dispatch(decLoadingCount(meta));
          return result;
        })
        .catch((error) => {
          dispatch(decLoadingCount(meta));
          throw error;
        })
      };
  }

  return next(action);
};

export default etsLoading;
