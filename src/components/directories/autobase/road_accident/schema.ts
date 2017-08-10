import * as moment from 'moment';

import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { getRequiredFieldMessage } from 'utils/validate';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'accident_date',
      title: 'Дата',
      type: 'date',
      required: true,
    },
    {
      key: 'driver_id',
      title: 'Водитель',
      type: 'number',
      required: true,
    },
    {
      key: 'cause_id',
      title: 'Причина ДТП',
      type: 'number',
      required: true,
    },
    {
      key: 'accident_place',
      title: 'Место ДТП',
      type: 'string',
      maxLength: 1024,
    },
    {
      key: 'damage_price',
      title: 'Стоимость ущерба, руб.',
      type: 'number',
      maxLength: 128,
      min: 0,
    },
    {
      key: 'comment',
      title: 'Примечание прохождения',
      type: 'string',
      maxLength: 2048,
    },
    {
      key: 'cause_name',
      title: 'Причина ДТП',
    },
    {
      key: 'is_guilty',
      title: 'Виновность',
    },
  ],
  dependencies: {
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
  },
};
