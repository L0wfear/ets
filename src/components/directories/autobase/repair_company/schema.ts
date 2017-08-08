import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'name',
      title: 'Наименование ремонтной организации',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    {
      key: 'comment',
      title: 'Примечание',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
  ],
};
