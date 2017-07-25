/**
 * Всё то, что не приходит с бэка для заполнения данными выпадающих списков и других элементов интерфейса.
 */

export const MISSION_STATUS_LABELS = {
  assigned: 'Назначено',
  not_assigned: 'Не назначено',
  complete: 'Выполнено',
  fail: 'Не выполнено',
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
export const TECH_MAIN_ORDER_SEQUENCE_SELECT_OPTIONS = new Array(20).fill(0).map((item, i) => ({ value: i + 1, label: i + 1 }));

export const YES_NO_SELECT_OPTIONS_BOOL = [{ label: 'Да', value: true }, { label: 'Нет', value: false }];
export const YES_NO_SELECT_OPTIONS_INT = [{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }];
export const IS_NOT_SELECT_OPTIONS_INT = [{ label: 'Есть', value: 1 }, { label: 'Нет', value: 0 }];
