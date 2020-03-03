import { DUTY_MISSION_STATUS, DUTY_MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/duty_mission/constants';

export const MISSION_STATUS = {
  ...DUTY_MISSION_STATUS,
  in_progress: 'in_progress',
  expired: 'expired',
  canceled: 'canceled',
} as const;

export const MISSION_STATUS_LABELS: Record<typeof MISSION_STATUS[keyof typeof MISSION_STATUS], string> = {
  ...DUTY_MISSION_STATUS_LABELS,
  [MISSION_STATUS.in_progress]: 'Выполняется',
  [MISSION_STATUS.expired]: 'Просрочено',
  [MISSION_STATUS.canceled]: 'Отменено',
} as const;
