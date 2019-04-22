/**
 * Всё то, что не приходит с бэка для заполнения данными выпадающих списков и других элементов интерфейса.
 */

export const MISSION_STATUS = {
  assigned: 'assigned',
  in_progress: 'in_progress',
  expired: 'expired',
  not_assigned: 'not_assigned',
  complete: 'complete',
  fail: 'Не fail',
  canceled: 'canceled',
};

export const MISSION_STATUS_LABELS = {
  [MISSION_STATUS.assigned]: 'Назначено',
  [MISSION_STATUS.in_progress]: 'Выполняется',
  [MISSION_STATUS.expired]: 'Просрочено',
  [MISSION_STATUS.not_assigned]: 'Не назначено',
  [MISSION_STATUS.complete]: 'Выполнено',
  [MISSION_STATUS.fail]: 'Не выполнено',
  [MISSION_STATUS.canceled]: 'Отменено',
};

export const ORDER_STATUS_KEYS = {
  published: 'published',
  cancelled: 'cancelled',
  partially_cancelled: 'partially_cancelled',
  suspended: 'suspended',
  partially_suspended: 'partially_suspended',
};

export const ORDER_ASSIGNMENTS_STATUS_KEYS = {
  full: 'full',
  partial: 'partial',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS_KEYS.published]: 'Опубликовано',
  [ORDER_STATUS_KEYS.cancelled]: 'Отменено',
  [ORDER_STATUS_KEYS.partially_cancelled]: 'Частично отменено',
  [ORDER_STATUS_KEYS.suspended]: 'Приостановлено',
  [ORDER_STATUS_KEYS.partially_suspended]: 'Частично приостановлено',
};

export const GEOZONE_OBJECTS = [
  { value: 'odh', label: 'Объект дорожного хозяйства' },
  { value: 'dt', label: 'Дворовая территория' },
];

export const GEOZONE_ELEMENTS = {
  odh: [
    { value: 'roadway', label: 'Проезжая часть' },
    { value: 'footway', label: 'Тротуар' },
  ],
  dt: [{ value: 'yard', label: 'Двор' }],
};

export const TIME_MEASURES = {
  year: 'Год.',
  day: 'Дн.',
  month: 'Мес.',
};

export const TIME_MEASURES_SELECT_OPTIONS = Object.keys(TIME_MEASURES).map(
  (key) => ({ label: TIME_MEASURES[key], value: key }),
);
export const SEQUENCE_1_TO_20_SELECT_OPTIONS = new Array(20)
  .fill(0)
  .map((item, i) => ({ value: i + 1, label: i + 1 }));

export const YES_NO_SELECT_OPTIONS_BOOL = [
  { label: 'Да', value: true },
  { label: 'Нет', value: false },
];
export const YES_NO_SELECT_OPTIONS_BOOL_STRING = [
  { value: 'TRUE', label: 'Нет' },
  { value: 'False', label: 'Да' },
];
export const YES_NO_SELECT_OPTIONS_INT = [
  { label: 'Да', value: 1 },
  { label: 'Нет', value: 0 },
];
export const IS_NOT_SELECT_OPTIONS_INT = [
  { label: 'Есть', value: 1 },
  { label: 'Нет', value: 0 },
];
export const IS_NOT_SELECT_OPTIONS = [
  { label: 'Есть', value: true },
  { label: 'Нет', value: false },
];
export const READ_NOT_SELECT_OPTIONS_INT = [
  { label: 'Прочитано', value: 1 },
  { label: 'Не прочитано', value: 0 },
];

export const WORK_NOT_SELECT_OPTIONS = [
  { value: true, label: 'Работает' },
  { value: false, label: 'Не работает' },
];
