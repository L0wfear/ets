import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';

export const formValidationSchema: SchemaType<any, any> = {
  properties: {
    remark: {
      title: 'Замечание',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
      maxLength: 1024 * 4,
    },
  },
};
