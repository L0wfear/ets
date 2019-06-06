import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';

export const registryKey = 'lastRequestMissionInfo';

export const getConfig = (array: EdcRequestInfo['missions']): TypeConfigData<ValuesOf<EdcRequestInfo['missions']>> => ({
  noInitialLoad: true, // удалить, если подрубить напрямую к реестру
  Service: {
    // getRegistryData: {
    //   entity: `edc/request/${request_id}/info`,
    //   typeAns: 'result.rows.missions',
    //   typeExtra: 'result.rows.edc_date',
    //   payload: {
    //     original: false,
    //   },
    // },
  },
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
          key: 'title_name',
          title: 'Задание/Наряд-задание',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
          sortable: false,
        },
        {
          key: 'status_name',
          title: 'Статус',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
      ],
    },
  },
});
