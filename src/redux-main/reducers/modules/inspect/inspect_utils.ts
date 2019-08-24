import { getDateWithMoscowTz, diffDatesByDays } from "utils/dates";

export const STATUS_INSPECT_CONDITING = 'conducting';
export const STATUS_INSPECT_COMPLETED = 'completed';

export const STATUS_INSPECT = {
  STATUS_INSPECT_CONDITING,
  STATUS_INSPECT_COMPLETED,
};

export const STATUS_TITLE_BY_SLUG = {
  [STATUS_INSPECT_CONDITING]: 'Проводится',
  [STATUS_INSPECT_COMPLETED]: 'Завершена',
};

export const isInspectIsCompleted = (status: 'conducting' | 'completed') => (
  status === STATUS_INSPECT_COMPLETED
);
/**
 * Получаем последнюю за текущий день закрытую испекцию
 */
export const getTodayCompletedInspect = (inspectArray: any[]) => (
  inspectArray.find((inspect) => (
    isInspectIsCompleted(inspect.status)
    && diffDatesByDays(getDateWithMoscowTz(), inspect.date_end) === 0
  ))
);

export const isInspectIsConducting = (status: 'conducting' | 'completed') => (
  status === STATUS_INSPECT_CONDITING
);
/**
 * Получаем последнюю открытую испекцию
 */
export const getTodayConductingInspect = (inspectArray: any[]) => (
  inspectArray.find((inspect) => isInspectIsConducting(inspect.status))
);
