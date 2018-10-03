/**
 * Всё то, что не приходит с бэка для заполнения данными выпадающих списков и других элементов интерфейса.
 */

export const AUTOBASE_REPAIR_STATUS = {
  passed: {
    name: 'Пройден',
    has: [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ],
  },
  failed: {
    name: 'Не пройден',
    has: [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ],
  },
  planned: {
    name: 'Запланирован',
    has: [
      'plan_date_start',
      'plan_date_end',
    ],
    disabled: true,
  },
  in_progress: {
    name: 'Прохождение',
    has: [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
    ],
    disabled: true,
  },
};

export const MISSION_STATUS_LABELS = {
  assigned: 'Назначено',
  in_progress: 'Выполняется',
  expired: 'Просрочено',
  not_assigned: 'Не назначено',
  complete: 'Выполнено',
  fail: 'Не выполнено',
};

export const DUTY_MISSION_STATUS_LABELS = {
  assigned: 'Назначено',
  not_assigned: 'Не назначено',
  complete: 'Выполнено',
  fail: 'Не выполнено',
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
  partial: 'partial'
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
  dt: [
    { value: 'yard', label: 'Двор' },
  ],
};

export const TIME_MEASURES = {
  year: 'Год.',
  day: 'Дн.',
  month: 'Мес.',
};

export const TIME_MEASURES_SELECT_OPTIONS = Object.keys(TIME_MEASURES).map(key => ({ label: TIME_MEASURES[key], value: key }));
export const SEQUENCE_1_TO_20_SELECT_OPTIONS = new Array(20).fill(0).map((item, i) => ({ value: i + 1, label: i + 1 }));

export const YES_NO_SELECT_OPTIONS_BOOL = [{ label: 'Да', value: true }, { label: 'Нет', value: false }];
export const YES_NO_SELECT_OPTIONS_INT = [{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }];
export const IS_NOT_SELECT_OPTIONS_INT = [{ label: 'Есть', value: 1 }, { label: 'Нет', value: 0 }];
export const READ_NOT_SELECT_OPTIONS_INT = [{ label: 'Прочитано', value: 1 }, { label: 'Не прочитано', value: 0 }];
