import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'remark',
      title: 'Замечание',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    {
      key: 'comment',
      title: 'Комментарий',
      type: 'string',
      maxLength: 1024 * 4,
    },
  ],
};
