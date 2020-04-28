import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const formValidationSchema: SchemaType<any, any> = {
  properties: {
    reviewed_at: {
      title: 'Дата осмотра',
      type: 'date',
      required: true,
    },
    percent: {
      title: 'Процент выполнения',
      type: 'number',
      integer: true,
      max: 100,
      min: 0,
      required: true,
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
      maxLength: 2048,
    },
  },
};
