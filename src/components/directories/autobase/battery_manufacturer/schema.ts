import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
   properties: [
    {
      key: 'name',
      title: 'Производитель аккумулятора',
      type: 'string',
      required: true,
    },
  ],
};

export default formValidationSchema;
