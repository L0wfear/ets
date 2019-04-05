export type OneSchema = {
  name: string;
  has: string[];
  disabled: boolean;
};

export type AUTOBASE_REPAIR_STATUS_SCHEMA = {
  [key: string]: OneSchema;
};

export const passed = 'passed';
export const failed = 'failed';
export const planned = 'planned';
export const in_progress = 'in_progress';

export const AUTOBASE_REPAIR_STATUS: AUTOBASE_REPAIR_STATUS_SCHEMA = {
  [passed]: {
    name: 'Пройден',
    has: [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ],
    disabled: false,
  },
  [failed]: {
    name: 'Не пройден',
    has: [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ],
    disabled: false,
  },
  [planned]: {
    name: 'Запланирован',
    has: [
      'plan_date_start',
      'plan_date_end',
    ],
    disabled: true,
  },
  [in_progress]: {
    name: 'Прохождение',
    has: [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
    ],
    disabled: true,
  },
};
