import * as moment from 'moment';
import { F } from 'ramda';

import { IValidationSchema } from 'components/ui/form/@types/validation.h';

import { getRequiredFieldMessage } from 'utils/validate';
import {
  hasMotohours,
} from 'utils/functions';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'tech_maintenance_order_ids',
      title: 'Регламент ТО',
      type: 'array',
      required: true,
    },
    {
      key: 'repair_company_id',
      title: 'Исполнитель ремонта',
      type: 'number',
    },
    {
      key: 'gov_number',
      isSubmitted: F,
    },
    {
      key: 'car_model_id',
      isSubmitted: F,
    },
    {
      key: 'number',
      title: 'Номер документа',
      type: 'string',
      maxLength: 128,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания',
      type: 'date',
    },
    {
      key: 'fact_date_start',
      title: 'Плановая дата начала',
      type: 'date',
    },
    {
      key: 'fact_date_end',
      title: 'Плановая дата окончания',
      type: 'date',
    },
    {
      key: 'odometr_fact',
      title: 'Пробег на момент ТО, км',
      type: 'number',
      maxLength: 128,
      integer: true,
    },
    {
      key: 'motohours_fact',
      title: 'Счетчик м/ч на момент ТО, м/ч',
      type: 'number',
      maxLength: 128,
      integer: true,
    },
    {
      key: 'note',
      title: 'Номер документа',
      type: 'string',
      maxLength: 2048,
    },
  ],
  dependencies: {
    repair_company_id: [
      {
        validator(value = '', { fact_date_start = '' }) {
          if (fact_date_start && !value) {
            return getRequiredFieldMessage('Исполнитель ремонта');
          }

          return '';
        },
      },
    ],
    plan_date_end: [
      {
        validator(value = null, { plan_date_start = null }) {
          if (!value) {
            return getRequiredFieldMessage('Плановая дата окончания');
          }

          if (plan_date_start) {
            const start = moment(plan_date_start).unix();
            const end = moment(value).unix();

            return end >= start
              ? ''
              : '"Плановая дата окончания" должна быть >= "Плановая дата начала ремонта"';
          }

          return '';
        },
      },
    ],
    fact_date_end: [
      {
        validator(value = null, { fact_date_start = null }) {
          if (fact_date_start && value) {
            const start = moment(fact_date_start).unix();
            const end = moment(value).unix();

            return end >= start
              ? ''
              : '"Фактическая дата окончания" должна быть >= "Фактическая дата начала ремонта"';
          }

          return '';
        },
      },
    ],
    odometr_fact: [
      {
        validator(value = null, { fact_date_start = null, fact_date_end = null, gov_number }) {
          if (
            (fact_date_start || fact_date_end) &&
            !value &&
            !hasMotohours(gov_number)
          ) {
            return getRequiredFieldMessage('Пробег на момент ТО, км');
          }

          return '';
        },
      },
    ],
    motohours_fact: [
      {
        validator(value = null, { fact_date_start = null, fact_date_end = null, gov_number }) {
          if (
            (fact_date_start || fact_date_end) &&
            !value &&
            hasMotohours(gov_number)
          ) {
            return getRequiredFieldMessage('Счетчик м/ч на момент ТО, м/ч');
          }

          return '';
        },
      },
    ],
  },
};
