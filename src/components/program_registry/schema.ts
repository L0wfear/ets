import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'name',
      title: 'Наименование государственной программы',
      type: 'string',
      required: true,
    },
  ],
};
