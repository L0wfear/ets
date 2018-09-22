import {
  PAGINATOR_UPDATE_DATA,
  PAGINATOR_RESET_DATA,
} from 'components/ui/new/paginator/redux-main/paginator';

export const paginatorUpdateData = (uniqKey, changedPaginatorData) => ({
  type: PAGINATOR_UPDATE_DATA,
  payload: {
    uniqKey,
    changedPaginatorData,
  }
});

export const paginatorResetData = (uniqKey) => ({
  type: PAGINATOR_RESET_DATA,
  payload: {
    uniqKey,
  }
});
