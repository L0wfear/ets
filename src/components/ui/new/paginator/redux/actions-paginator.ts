import {
  PAGINATOR_UPDATE_DATA,
} from 'components/ui/new/paginator/redux/paginator';

export const paginatorUpdateData = (uniqKey, changedPaginatorData) => ({
  type: PAGINATOR_UPDATE_DATA,
  payload: {
    uniqKey,
    changedPaginatorData,
  }
});
