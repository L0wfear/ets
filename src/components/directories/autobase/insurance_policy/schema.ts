import * as moment from 'moment';

import { IValidationSchema } from 'components/ui/form/@types/validation.h';
import { getRequiredFieldMessage } from 'utils/validate';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'car_id',
      title: 'Номер транспортного средства',
      type: 'number',
      required: true,
    },
    {
      key: 'insurer',
      title: 'Страховая организация',
      type: 'string',
      required: true,
      maxLength: 256,
    },
    {
      key: 'insurance_type_id',
      title: 'Тип страхования',
      type: 'number',
      required: true,
    },
    {
      key: 'seria',
      title: 'Серия',
      type: 'string',
    },
    {
      key: 'number',
      title: 'Номер',
      type: 'string',
      maxLength: 128,
      required: true,
      min: 0,
    },
    {
      key: 'date_start',
      title: 'Дата начала действия',
      type: 'date',
      required: true,
    },
    {
      key: 'date_end',
      title: 'Дата окончания действия',
      type: 'date',
      required: true,
    },
    {
      key: 'price',
      title: 'Стоимость, руб.',
      type: 'number',
      maxLength: 128,
      min: 0,
      integer: false,
      float: 2,
    },
    {
      key: 'note',
      title: 'Примечание',
      type: 'string',
      maxLength: 2048,
      min: 0,
    },
  ],
  dependencies: {
    date_end: [
      {
        validator(value = null, { date_start = null }) {
          if (!value) {
            return getRequiredFieldMessage('Дата окончания действия');
          }

          if (date_start) {
            const start = moment(date_start).unix();
            const end = moment(value).unix();

            return end >= start
              ? ''
              : '"Дата окончания действия" должна быть позже "Даты начала действия"';
          }

          return '';
        },
      },
    ],
  },
};

export default formValidationSchema;
