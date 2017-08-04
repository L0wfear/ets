import * as moment from 'moment';

import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { getRequiredFieldMessage } from 'utils/validate';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'car_id',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
    },
    {
      key: 'reg_number',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
      equalLength: 21,
    },
    {
      key: 'date_end',
      title: 'Срок действия до',
      type: 'date',
      required: true,
    },
    {
      key: 'date_start',
      title: 'Дата прохождения',
      type: 'date',
      required: true,
    },
    {
      key: 'tech_operator',
      title: 'Оператор технического осмотра / пункт технического осмотра',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'is_allowed',
      title: 'Заключение о возможности/невозможности эксплуатации ТС',
      type: 'boolean',
    },
    {
      key: 'note',
      title: 'Примечание прохождения',
      type: 'string',
    },
  ],
  dependencies: {
    date_end: [
      {
        validator(value = null, { date_start = null }) {
          if (!value) {
            return getRequiredFieldMessage('Плановая дата окончания');
          }

          if (date_start) {
            const start = moment(date_start).unix();
            const end = moment(value).unix();

            return end >= start
              ? ''
              : '"Срок действия до" должен быть позже "Дата прохождения"';
          }

          return '';
        },
      },
    ],
  },
};
