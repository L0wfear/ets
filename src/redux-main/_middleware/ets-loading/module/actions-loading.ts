import {
  ETS_LOADING_INC,
  ETS_LOADING_DEC,
  ETS_LOADING_RESET,
} from 'redux-main/_middleware/ets-loading/module/loading';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const incLoadingCount = ({ page, path }: LoadingMeta) => ({
  type: ETS_LOADING_INC,
  payload: {
    page,
    path,
  },
});

export const decLoadingCount = ({ page, path }: LoadingMeta) => ({
  type: ETS_LOADING_DEC,
  payload: {
    page,
    path,
  },
});

export const resetAllLoadingCount = () => ({
  type: ETS_LOADING_RESET,
  payload: {
    page: 'allCount',
    path: 'allCount',
  },
});

