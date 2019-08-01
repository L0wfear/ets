import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { EdcRequestCancelFormProps, EdcRequestCancel } from './@types/EdcRequestCancel';

export const edcRequestCancelSchema: SchemaType<EdcRequestCancel, EdcRequestCancelFormProps> = {
  properties: {
    cancel_reason_id: {
      title: 'Причина',
      type: 'valueOfArray',
      required: true,
    },
  },
};
