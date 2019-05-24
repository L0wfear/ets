import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';

export const registryKey = 'requestHistoryList';

export const getConfig = (array: EdcRequestInfo['missions']): TypeConfigData<ValuesOf<EdcRequestInfo['missions']>> => ({
  noInitialLoad: true,
  Service: {},
  registryKey,
  header: {
    title: '',
    buttons: [],
  },
  list: {
    permissions: edcRequestPermissions,
    data: {
      uniqKey: 'front_custom_id',
      uniqKeyForParams: `${registryKey}_id`,
      fixedWidth: true,
      array,
    },
    meta: {
      row_double_click: true,
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'Задание/Наряд-задание',
          title: 'Процент выполнения (%)',
          format: '',                         // вместо renderers
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
          sortable: false,
        },
        {
          key: 'current_percentage',
          title: 'Процент выполнения (%)',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
      ],
    },
  },
});
