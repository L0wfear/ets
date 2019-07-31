import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import { PropsInspectActFileForm } from './@types/InspectActFileForm';

export const inspectActFileFormSchema: SchemaType<InspectOneActScan, PropsInspectActFileForm> = {
  properties: {
    files: {
      title: 'Файл',
      type: 'multiValueOfArray',
      dependencies: [
        (files) => {
          if (!files.length) {
            return 'Поле "Файл" должно быть заполнено';
          }
        },
      ],
    },
    notes: {
      title: 'Примечание',
      type: 'string',
      required: true,
      maxLength: 400,
    },
  },
};
