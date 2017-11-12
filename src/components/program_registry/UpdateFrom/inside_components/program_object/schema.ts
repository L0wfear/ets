import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'asuods_id',
      title: 'Информация об объекте',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'plan_date_start',
      title: 'Информация об объекте',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Информация об объекте',
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
