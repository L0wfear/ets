import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import inspectActScanPermissions from './permissions';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import { InspectRegistryService } from 'api/Services';

export const registryKey = 'inspect_acts';

export const getConfig = (inspection_id: number, path: string): TypeConfigData<InspectOneActScan> => ({
  Service: {
    getRegistryData: {
      entity: `${InspectRegistryService._path}/${inspection_id}`,
      format: 'inspect_act_scan',
    },
  },
  registryKey,
  path,
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
      fixedWidth: true,
    },
    meta: {
      row_double_click: false,
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
