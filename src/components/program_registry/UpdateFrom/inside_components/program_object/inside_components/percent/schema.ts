import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'reviewed_at',
      title: 'Дата осмотра',
      type: 'number',
      max: 100,
      required: true,
    },
    {
      key: 'percent',
      title: 'Процент выполнения',
      type: 'number',
      integer: true,
      max: 100,
      min: 0,
      required: true,
    },
    {
      key: 'comment',
      title: 'Комментарий',
      type: 'string',
      max: 2048,
    },
  ],
};
