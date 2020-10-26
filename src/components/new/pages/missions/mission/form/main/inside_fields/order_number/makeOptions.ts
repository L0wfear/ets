import memoize from 'memoize-one';

import { createValidDateTimeDots, isCrossDates } from 'components/@next/@utils/dates/dates';

const filterArray = (
  array,
  date_start,
  date_end
) => {

  return array.filter((arr) =>
    (arr.status === 'published' || arr.status === 'partially_cancelled' || arr.status === 'partially_suspended')
    && isCrossDates(arr.order_date, arr.order_date_to, date_start, date_end));
};

export const makeOptionsOrderNumberForMissionList = (
  memoize(
    (
      array,
      date_start,
      date_end
    ) => (
      filterArray(array, date_start, date_end).map((rowData) => ({
        value: rowData.id,
        label: `${rowData.order_number} (Начало действия ${createValidDateTimeDots(rowData.order_date)} - Окончание действия ${createValidDateTimeDots(rowData.order_date_to)})`,
        rowData,
      }))
    )
  )
);

export const makeFilteredTOList = (
  memoize(
    (
      array,
      technicalOperationRegistryForMissionList
    ) => (
      array.filter((to1) => {
        return technicalOperationRegistryForMissionList.some((to2) => {
          return (to1.id === to2.id && to2.norm_ids.find((norm) => norm === to1.norm_id));
        });
      })
    )
  )
);
