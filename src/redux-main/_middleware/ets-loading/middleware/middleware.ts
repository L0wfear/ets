import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { get } from 'lodash';

const etsLoading = ({ dispatch }) => (next) => (action) => {
  const { meta = { promise: false, page: '', path: '' } } = action;

  if (meta.promise && typeof get(action, 'payload.then', null) === 'function') {
    etsLoadingCounter(
      dispatch,
      action.payload,
      {
        page: meta.page,
        path: meta.path,
      },
    ).then((result) => {
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
    });
  }

  return next(action);
};

export default etsLoading;
