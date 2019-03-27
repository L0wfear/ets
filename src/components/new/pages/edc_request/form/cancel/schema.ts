import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { EdcRequestCancelFormProps, EdcRequestCancel } from './@types/EdcRequestCancel';

export const edcRequestCancelSchema: SchemaType<EdcRequestCancel, EdcRequestCancelFormProps> = {
  properties: [
    {
      key: 'cancel_reason_id',
      title: 'Причина',
      type: 'valueOfArray',
      required: true,
    },
  ],
};
