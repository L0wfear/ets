import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { diffDates } from 'utils/dates';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'asuods_id',
      title: 'Наименование ДТ',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала',
      type: 'date',
      required: true,
    },
    {
      key: 'fact_date_start',
      title: 'Фактическая дата начала',
      type: 'date',
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания',
      type: 'date',
      required: true,
    },
    {
      key: 'note',
      title: 'Примечание',
      type: 'string',
      required: false,
    },
  ],
  dependencies: {
    plan_date_start: [
      {
        validator(plan_date_start, { plan_date_end, status }) {
          if (plan_date_start) {
            if (plan_date_end && diffDates(plan_date_start, plan_date_end) >= 0) {
              return 'Дата планируемого начала должна быть раньше даты планируемого окончания';
            }
          }
          return null;
        },
      },
    ],
    fact_date_start: [
      {
        validator(fact_date_start, { fact_date_end, status }) {
          if (fact_date_start) {
            if (fact_date_end && diffDates(fact_date_start, fact_date_end) >= 0) {
              return 'Дата фактического начала должна быть раньше даты фактического окончания';
            }
          }
          return null;
        },
      },
    ],
  },
};

export const elementsValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'object_property_id',
      title: 'Элемент ДТ',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'plan',
      title: 'План',
      type: 'number',
      integer: true,
      required: true,
      maxLength: 128,
    },
    {
      key: 'fact',
      title: 'Факт',
      type: 'number',
      integer: true,
      required: false,
      maxLength: 128,
    },
    {
      key: 'warranty_up_to',
      title: 'Плановая дата окончания',
      type: 'date',
      required: false,
    },
  ],
  dependencies: {
    plan: [
      {
        validator(value = null) {
          if (!!value && value < 0) {
            return 'error';
          }
          return '';
        },
      },
    ],
    fact: [
      {
        validator(value = null) {
          if (!!value && value < 0) {
            return 'error';
          }
          return '';
        },
      },
    ],
  },
};
