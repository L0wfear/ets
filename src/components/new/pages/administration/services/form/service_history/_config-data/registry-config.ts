import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import servicesPermissions from 'components/new/pages/administration/services/_config-data/permissions';
import { ServiceHistroy } from 'redux-main/reducers/modules/services/@types/services';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { ReportServiceHistoryService } from 'api/Services';

export const registryKey = 'service_history_registry';

export const getConfig = (service_id: number, service_name, date_start: string, date_end: string): TypeConfigData<ServiceHistroy> => ({
  Service: {
    getRegistryData: {
      entity: ReportServiceHistoryService._path,
      payload: {
        service_id,
        date_start,
        date_end,
      },
    },
    getBlobData: {
      entity: ReportServiceHistoryService._path,
      payload: {
        format: 'xls',
        service_id,
        date_start,
        date_end,
      },
    },
  },
  registryKey,
  header: {
    title: `История изменений по сервису "${service_name}"`,
    format: 'datetime_range_picker',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.export_filtred_data,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'user_id',
        labelKey: 'user_login',
        title: 'Пользователь',
        type: 'multiselect',
      },
      {
        valueKey: 'remote_ip',
        title: 'IP-адрес',
        type: 'multiselect',
      },
      {
        valueKey: 'action',
        labelKey: 'action_name',
        title: 'Действие',
        type: 'multiselect',
      },
    ],
  },
  list: {
    permissions: servicesPermissions,
    data: {
      fixedWidth: true,
      uniqKeyForParams: 'service_history_registry_id',
    },
    meta: {
      fields: [
        {
          key: 'action_at',
          title: 'Дата и время',
          format: 'datetime',
          width: 200,
        },
        {
          key: 'user_login',
          title: 'Пользователь',
          width: 200,
        },
        {
          key: 'remote_ip',
          title: 'IP-адрес',
          width: 200,
        },
        {
          key: 'action_name',
          title: 'Действие',
          width: 200,
        },
      ],
    },
  },
});
