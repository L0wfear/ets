import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/user_acces/_config-data/permissions';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';

export const registryKey = 'UsersAccess';

export const config: TypeConfigData<User> = {
  Service: {
    getRegistryData: {
      entity: 'user_access_registry',
      payload: {
        for: 'inspect'
      }
    },
    getBlobData: {
      entity: 'user_access_registry',
      payload: {
        for: 'inspect',
        format: 'xls',
      }
    }
  },
  registryKey,
  header: {
    title: 'Реестр настройки доступов',
    buttons: [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'okrug_name',
        type: 'multiselect',
        title: 'Округ',
      },
      {
        valueKey: 'company_name',
        type: 'multiselect',
        title: 'Организация',
      },
      {
        valueKey: 'personnel_number',
        type: 'multiselect',
        title: 'Табельный номер',
      },
      {
        valueKey: 'position_name',
        type: 'multiselect',
        title: 'Делопроизводитель',
      },
      {
        valueKey: 'full_name',
        type: 'multiselect',
        title: 'ФИО',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'user_id',
      fixedWidth: true,
      uniqKeyForParams: 'user_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'okrug_name_text',
          title: 'Округ',
          width: 150,
        },
        {
          key: 'company_name_text',
          title: 'Организация',
          width: 300,
        },
        {
          key: 'personnel_number_text',
          title: 'Табельный номер',
          width: 300,
        },
        {
          key: 'position_name_text',
          title: 'Делопроизводитель',
          width: 300,
        },
        {
          key: 'full_name_text',
          title: 'ФИО',
          width: 300,
        },
      ],
    },
  },
};
