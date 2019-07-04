import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import { PropsInspectActFileForm } from './@types/InspectActFileForm';

export const inspectActFileFormSchema: SchemaType<InspectOneActScan, PropsInspectActFileForm> = {
  properties: {
    name: {
      title: 'Файл',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    notes: {
      title: 'Примечание',
      type: 'string',
      required: true,
      maxLength: 400,
    },
  },
};
