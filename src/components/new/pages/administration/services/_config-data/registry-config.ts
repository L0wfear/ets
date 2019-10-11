import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/administration/services/_config-data/permissions';
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import { ServicesService } from 'api/Services';

export const registryKey = 'service_registry';

export const config: TypeConfigData<Service> = {
  Service: {
    getRegistryData: {
      entity: ServicesService._path,
    },
  },
  registryKey,
  header: {
    title: 'Управление интеграционными сервисами',
    buttons: [],
  },
  list: {
    permissions,
    data: {
      fixedWidth: true,
      uniqKeyForParams: 'service_registry_id',
    },
    meta: {
      fields: [
        {
          key: 'name',
          title: 'Наименование сервиса',
          width: 200,
        },
        {
          key: 'url',
          title: 'URL',
          width: 400,
        },
        {
          key: 'from',
          title: 'Откуда',
          width: 150,
        },
        {
          key: 'to',
          title: 'Куда',
          width: 150,
        },
        {
          key: 'services_actions_on_off',
          title: 'Действие',
          sortable: false,
          width: 150,
        },
        {
          key: 'last_action_at',
          title: 'Дата последнего действия',
          format: 'datetime',
          width: 225,
        },
        {
          key: 'user_login',
          title: 'Пользователь',
          width: 150,
        },
        {
          key: 'service_files',
          title: 'Спецификации',
          width: 400,
          sortable: false,
        },
        {
          key: 'button_show_action_log',
          title: 'История изменений',
          width: 175,
          sortable: false,
        },
      ],
    },
  },
};
