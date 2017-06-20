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

export const YES_NO_SELECT_OPTIONS_BOOL = [{ label: 'Да', value: true }, { label: 'Нет', value: false }];
export const YES_NO_SELECT_OPTIONS_INT = [{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }];
