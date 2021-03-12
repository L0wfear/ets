import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/user_acces/_config-data/permissions';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

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
      entity: 'user_access_registry/export',
      payload: {
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
      buttonsTypes.export_filtred_data,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'okrug_name',
        labelKey: 'okrug_name_text',
        type: 'multiselect',
        title: [
          {
            title: 'Округ',
            displayIf: displayIfContant.isKgh,
          }
        ],
      },
      {
        valueKey: 'company_name',
        labelKey: 'company_name_text',
        type: 'multiselect',
        title: [
          {
            title: 'Организация',
            displayIf: displayIfContant.isKgh,
          }
        ],
      },
      {
        valueKey: 'full_name',
        labelKey: 'full_name_text',
        type: 'multiselect',
        title: 'Фамилия Имя Отчество',
      },
      {
        valueKey: 'personnel_number',
        labelKey: 'personnel_number_text',
        type: 'multiselect',
        title: 'Табельный номер',
      },
      {
        valueKey: 'position_name',
        labelKey: 'position_name_text',
        type: 'multiselect',
        title: 'Должность',
      },
      {
        valueKey: 'status',
        type: 'multiselect',
        title: 'Статус',
      },
      {
        valueKey: 'access_okrugs_ids',
        labelKey: 'access_okrugs',
        type: 'multiselect',
        title: 'Доступ к округу',
      },
      {
        valueKey: 'access_companies_ids',
        labelKey: 'access_companies',
        type: 'multiselect',
        title: 'Доступ к организации',
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
    processed: {
      filterValues: {},
      sort: {
        field: 'full_name',
        reverse: false,
      },
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'okrug_name_text',
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          dashIfEmpty: true,
          width: 150,
        },
        {
          key: 'company_name_text',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
          ],
          dashIfEmpty: true,
          width: 150,
        },
        {
          key: 'full_name_text',
          title: 'Фамилия Имя Отчество',
          width: 300,
          dashIfEmpty: true,
        },
        {
          key: 'personnel_number_text',
          title: 'Табельный номер',
          width: 300,
          dashIfEmpty: true,
        },
        {
          key: 'position_name_text',
          title: 'Должность',
          width: 300,
          dashIfEmpty: true,
        },
        {
          key: 'status',
          title: 'Статус',
          width: 300,
          dashIfEmpty: true,
        },
        {
          key: 'access_okrugs_text',
          title: 'Доступ к округу',
          width: 300,
          dashIfEmpty: true,
        },
        {
          key: 'access_companies_text',
          title: 'Доступ к организации',
          width: 300,
          dashIfEmpty: true,
        },
      ],
    },
  },
};
