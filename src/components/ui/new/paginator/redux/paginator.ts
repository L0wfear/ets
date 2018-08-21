import { createPath } from 'redux/redux-utils';

const PAGINATOR = createPath('PAGINATOR');

export const PAGINATOR_UPDATE_DATA = PAGINATOR`UPDATE_DATA`;

const initialState = {
  currentPage: 0,
  maxPage: 0,
  setPage: () => {},
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case PAGINATOR_UPDATE_DATA: {
      return {
        ...state,
        [payload.uniqKey]: {
          ...payload.changedPaginatorData,
        },
      };
    }
    default: {
      return state;
    }
  }
}