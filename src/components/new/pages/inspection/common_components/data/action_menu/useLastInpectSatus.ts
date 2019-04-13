import * as React from 'react';
import { STATUS_INSPECT_CONDITING, STATUS_INSPECT_COMPLETED, STATUS_TITLE_BY_SLUG } from 'redux-main/reducers/modules/inspect/inspect_utils';

export const INSPECT_STATUS = {
  noToday: 0,
  conditionLast: 1,
  completedLast: 2,
};

const getLabel = (status: number) => {
  switch (status) {
    case INSPECT_STATUS.noToday: return 'На текущий день проверка не создана';
    case INSPECT_STATUS.conditionLast: return STATUS_TITLE_BY_SLUG[STATUS_INSPECT_CONDITING];
    case INSPECT_STATUS.completedLast: return STATUS_TITLE_BY_SLUG[STATUS_INSPECT_COMPLETED];
  }
};

export const useLastInpectSatus = (lastConductingInspect: any, lastCompletedInspect: any) => {
  const status = React.useMemo(
    () => {
      if (lastConductingInspect) {
        return INSPECT_STATUS.conditionLast;
      }
      if (lastCompletedInspect) {
        return INSPECT_STATUS.completedLast;
      }
      return INSPECT_STATUS.noToday;
    },
    [lastConductingInspect, lastCompletedInspect],
  );

  return {
    status,
    status_text: getLabel(status),
  };
};

export default useLastInpectSatus;
