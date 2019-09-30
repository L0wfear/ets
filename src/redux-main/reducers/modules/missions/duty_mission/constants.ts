export const DUTY_MISSION_STATUS = {
  assigned: 'assigned',
  not_assigned: 'not_assigned',
  complete: 'complete',
  fail: 'fail',
} as const;

export const DUTY_MISSION_STATUS_LABELS = {
  [DUTY_MISSION_STATUS.assigned]: 'Назначено',
  [DUTY_MISSION_STATUS.not_assigned]: 'Не назначено',
  [DUTY_MISSION_STATUS.complete]: 'Выполнено',
  [DUTY_MISSION_STATUS.fail]: 'Не выполнено',
} as const;

export const DUTY_MISSION_STATUS_OPTIONS = Object.keys(DUTY_MISSION_STATUS_LABELS).map(
  (key) => ({
    label: DUTY_MISSION_STATUS_LABELS[key],
    value: key,
  }),
);
