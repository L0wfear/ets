import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
   properties: [
    {
      key: 'name',
      title: 'Марка шины',
      type: 'string',
      required: true,
    },
    {
      key: 'tire_manufacturer_id',
      title: 'Производитель шины',
      type: 'number',
      required: true,
    },
  ],
};

export default formValidationSchema;
