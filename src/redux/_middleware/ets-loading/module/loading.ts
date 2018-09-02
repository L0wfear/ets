import { createPath } from 'redux/redux-utils';

const ETS_LOADING = createPath('ETS_LOADING');

export const ETS_LOADING_RESET = ETS_LOADING`RESET`;
export const ETS_LOADING_INC = ETS_LOADING`LOADING_INC`;
export const ETS_LOADING_DEC = ETS_LOADING`LOADING_DEC`;

const initialState = {
  allCount: 0,
  countByPage: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ETS_LOADING_INC: {
      const { page = 'allCount', path = 'allCount' } = payload;
      const { [page]: pageCounters = { allCount: 0 } } = state.countByPage;
      const { [path]: pathCounter = 0 } = pageCounters;

      return {
        allCount: state.allCount + 1,
        countByPage: {
          ...state.countByPage,
          [page]: {
            ...pageCounters,
            allCount: pageCounters.allCount + 1,
            [path]: pathCounter + 1,
          },
        },
      };
    }
    case ETS_LOADING_DEC: {
      const { page = 'allCount', path = 'allCount' } = payload;
      const { [page]: pageCounters = { allCount: 0 } } = state.countByPage;
      const { [path]: pathCounter = 0 } = pageCounters;

      return {
        allCount: state.allCount - 1,
        countByPage: {
          ...state.countByPage,
          [page]: {
            ...pageCounters,
            allCount: pageCounters.allCount - 1,
            [path]: pathCounter - 1,
          },
        },
      };
    }
    case ETS_LOADING_RESET: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}