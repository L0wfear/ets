import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'remark',
      title: 'Номер поставки',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
  ],
};
