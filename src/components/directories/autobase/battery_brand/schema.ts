import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
   properties: [
    {
      key: 'name',
      title: 'Марка аккумулятора',
      type: 'string',
      required: true,
    },
    {
      key: 'manufacturer_id',
      title: 'Производитель аккумулятора',
      type: 'number',
      required: true,
    },
  ],
};

export default formValidationSchema;
