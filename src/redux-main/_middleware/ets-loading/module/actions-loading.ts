import {
  ETS_LOADING_INC,
  ETS_LOADING_DEC,
} from 'redux-main/_middleware/ets-loading/module/loading';

export const incLoadingCount = ({ page, path }) => ({
  type: ETS_LOADING_INC,
  payload: {
    page,
    path,
  },
});

export const decLoadingCount = ({ page, path }) => ({
  type: ETS_LOADING_DEC,
  payload: {
    page,
    path,
  },
});