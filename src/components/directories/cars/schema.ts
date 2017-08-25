import { IValidationSchema } from 'components/ui/form/@types/validation.h';

const carFormSchema: IValidationSchema = {
  properties: [
    // Main form
    {
      key: 'fuel_correction_rate',
      float: 2,
    },
    {
      key: 'note',
      type: 'text',
      maxLength: 4000,
    },
    {
      key: 'parking_address',
      type: 'string',
      maxLength: 2000,
    },
    // Register form
    {
      key: 'register_given_by',
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 256,
    },
    {
      key: 'register_note',
      title: 'Кем выдано свидетельство о регистрации',
      type: 'string',
      maxLength: 4000,
    },
  ],
};

export default carFormSchema;
