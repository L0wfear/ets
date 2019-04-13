import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { EdcRequestRejectFormProps, EdcRequestReject } from './@types/EdcRequestReject';

export const edcRequestRejectSchema: SchemaType<EdcRequestReject, EdcRequestRejectFormProps> = {
  properties: {
    rejection_reason_id: {
      title: 'Причина',
      type: 'valueOfArray',
      required: true,
    },
  },
};
