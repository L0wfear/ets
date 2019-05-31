import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import edcRequestPermissions from 'components/new/pages/edc_request/_config-data/permissions';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';

export const registryKey = 'requestHistoryList'; // Формировать из пропсов

export const getRegistryKey = (regIndex: number) => `${registryKey}_${regIndex}`;

export const getConfig = (array: EdcRequestInfo['missions'], index: number): TypeConfigData<ValuesOf<EdcRequestInfo['missions']>> => ({
  noInitialLoad: true,
  Service: {},
  registryKey: getRegistryKey(index),
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
          key: 'current_percentage',
          title: 'Процент выполнения (%)',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
        {
          key: 'status_name',
          title: 'Статус',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
        {
          key: 'date_end',
          title: 'Дата завершения',
          format: 'datetime',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
        {
          key: 'employee',
          title: 'Водитель/Бригадир',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
        {
          key: 'transport_name',
          title: 'Транспортное средство',
          dashIfEmpty: true,                  // '-', если пустота
          width: 200,
        },
      ],
    },
  },
});
