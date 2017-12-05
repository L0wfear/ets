import * as moment from 'moment';

import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { getRequiredFieldMessage } from 'utils/validate';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'state_program_id',
      title: 'Гос. программа',
      type: 'number',
      required: true,
    },
    {
      key: 'name',
      title: 'Наименование программы',
      type: 'string',
      required: true,
    },
    {
      key: 'repair_type_id',
      title: 'Тип ремонта',
      type: 'number',
      required: true,
    },
    {
      key: 'object_type_id',
      title: 'Тип объекта ремонта',
      type: 'number',
      required: true,
    },
    {
      key: 'plan_date_start',
      title: 'План. Начало',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'План. Завершение',
      type: 'date',
      required: true,
    },

    {
      key: 'is_active',
      title: 'Версия',
      type: 'boolean',
      required: true,
    },
    {
      key: 'fact_date_start',
      title: 'План. Начало',
      type: 'date',
    },
    {
      key: 'fact_date_end',
      title: 'План. Завершение',
      type: 'date',
    },
    {
      key: 'contractor_id',
      title: 'Подрядчик',
      type: 'boolean',
      required: true,
    },
    {
      key: 'is_active',
      title: '№ контракта',
      type: 'string',
      maxLength: 128,
      required: true,
    },
    {
      key: 'is_active',
      title: 'Примечание',
      type: 'string',
      maxLength: 2048,
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
  }
};
