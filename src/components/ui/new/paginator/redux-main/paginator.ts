import { createPath } from 'redux-main/redux-utils';

const PAGINATOR = createPath('PAGINATOR');

export const PAGINATOR_UPDATE_DATA = PAGINATOR`UPDATE_DATA`;
export const PAGINATOR_RESET_DATA = PAGINATOR`RESET_DATA`;

const initialState = {
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
    case PAGINATOR_RESET_DATA: {
      const copyState = { ...state };

      delete copyState[payload.uniqKey];

      return copyState;
    }
    default: {
      return state;
    }
  }
}