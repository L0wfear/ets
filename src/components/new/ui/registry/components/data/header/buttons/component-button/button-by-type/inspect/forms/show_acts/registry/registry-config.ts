import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import inspectActScanPermissions from './permissions';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { InspectActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';

export const registryKey = 'inspect_acts';

export const getConfig = (inspection_id: number): TypeConfigData<InspectActScan> => ({
  Service: {
    getRegistryData: {
      entity: `inspection/act/scan`,
      payload: {
        inspection_id,
      },
    },
  },
  registryKey,
  header: {
    title: '',
    buttons: [
      buttonsTypes.read,
      buttonsTypes.remove,
    ],
  },
  list: {
    permissions: inspectActScanPermissions,
    data: {
      uniqKey: 'id',
      uniqKeyForParams: 'edc_request_id',
      fixedWidth: true,
    },
    meta: {
      row_double_click: true,
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'name',
          title: 'Наименование файла',
          width: 200,
          format: 'link',
        },
        {
          key: 'notes',
          title: 'Примечание',
          width: 400,
        },
      ],
    },
  },
});
