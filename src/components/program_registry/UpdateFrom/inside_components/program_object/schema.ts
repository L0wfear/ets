import { IValidationSchema } from 'components/ui/form/@types/validation.h';

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
