export const MISSION_STATUS = {
  assigned: 'assigned',
  in_progress: 'in_progress',
  expired: 'expired',
  not_assigned: 'not_assigned',
  complete: 'complete',
  fail: 'fail',
  canceled: 'canceled',
} as const;

export const MISSION_STATUS_LABELS = {
  [MISSION_STATUS.assigned]: 'Назначено',
  [MISSION_STATUS.in_progress]: 'Выполняется',
  [MISSION_STATUS.expired]: 'Просрочено',
  [MISSION_STATUS.not_assigned]: 'Не назначено',
  [MISSION_STATUS.complete]: 'Выполнено',
  [MISSION_STATUS.fail]: 'Не выполнено',
  [MISSION_STATUS.canceled]: 'Отменено',
} as const;
