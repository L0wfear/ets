import { diffDates } from 'components/@next/@utils/dates/dates';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const formValidationSchema: SchemaType<any, any> = {
  properties: {
    asuods_id: {
      title: 'Наименование ДТ',
      type: 'number',
      integer: true,
      required: true,
    },
    plan_date_start: {
      title: 'Плановая дата начала',
      type: 'date',
      required: true,
      dependencies: [
        (plan_date_start, { plan_date_end, status }) => {
          if (plan_date_start) {
            if (plan_date_end && diffDates(plan_date_start, plan_date_end) >= 0) {
              return 'Дата планируемого начала должна быть раньше даты планируемого окончания';
            }
          }
          return null;
        },
      ],
    },
    fact_date_start: {
      title: 'Фактическая дата начала',
      type: 'date',
      dependencies: [
        (fact_date_start, { fact_date_end, status }) => {
          if (fact_date_start) {
            if (fact_date_end && diffDates(fact_date_start, fact_date_end) >= 0) {
              return 'Дата фактического начала должна быть раньше даты фактического окончания';
            }
          }
          return null;
        },
      ],
    },
    plan_date_end: {
      title: 'Плановая дата окончания',
      type: 'date',
      required: true,
    },
    note: {
      title: 'Примечание',
      type: 'string',
      required: false,
    },
  },
};

export const elementsValidationSchema: SchemaType<any, any> = {
  properties: {
    object_property_id: {
      title: 'Элемент ДТ',
      type: 'number',
      integer: true,
      required: true,
    },
    plan: {
      title: 'План',
      type: 'number',
      integer: true,
      required: true,
      maxLength: 128,
      dependencies: [
        (value = null) => {
          if (!!value && value < 0) {
            return 'error';
          }
          return '';
        }
      ],
    },
    fact: {
      title: 'Факт',
      type: 'number',
      integer: true,
      required: false,
      maxLength: 128,
      dependencies: [
        (value = null) => {
          if (!!value && value < 0) {
            return 'error';
          }
          return '';
        }
      ],
    },
    warranty_up_to: {
      title: 'Плановая дата окончания',
      type: 'date',
      required: false,
    },
  },
};
