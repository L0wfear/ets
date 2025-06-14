import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import userActionLogPermissions from './permissions';
import { UserActionLog } from 'redux-main/reducers/modules/user_action_log/@types/userActionLog';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'userActionLogRegistry';

export const getToConfig = (date_start: string, date_end: string): TypeConfigData<UserActionLog> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'user_action_log',
        payload: {
          date_start,
          date_end,
        },
      },
      getBlobData: {
        entity: 'user_action_log',
        payload: {
          format: 'xls',
          date_start,
          date_end,
        },
      },
    },
    registryKey,
    header: {
      title: 'Журнал действий пользователей',
      format: 'daterange_picker_userlog',
      buttons: [
        buttonsTypes.columns_control,
        buttonsTypes.filter,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_name',
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'action_at',
          title: 'Дата действия',
          type: 'advanced-date',
        },
        {
          valueKey: 'remote_ip',
          title: 'IP-адрес',
          type: 'multiselect',
        },
        {
          valueKey: 'user_login',
          title: 'Логин пользователя',
          type: 'multiselect',
        },
        {
          title: 'ФИО',
          valueKey: 'fio',
          type: 'multiselect',
        },
        {
          valueKey: 'action_name',
          title: 'Действие',
          type: 'multiselect',
        },
        {
          valueKey: 'content_type_name',
          title: 'Объект системы',
          type: 'multiselect',
        },
        {
          valueKey: 'entity_id',
          title: 'ID записи',
          type: 'multiselect',
        },
        {
          valueKey: 'repr',
          title: 'Номер/Наименование',
          type: 'multiselect',
        },
        {
          valueKey: 'structure_id',
          labelKey: 'structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: userActionLogPermissions,
      data: {
        fixedWidth: true,
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'okrug_name',
            title: [
              {
                title: 'Округ',
                displayIf: displayIfContant.isKgh,
              }
            ],
            width: 150,
          },
          {
            key: 'company_name',
            title: [
              {
                displayIf: displayIfContant.isKgh,
                title: 'Организация',
              },
            ],
          },
          {
            key: 'action_at',
            title: 'Дата действия',
            format: 'datetime',
          },
          {
            key: 'remote_ip',
            title: 'IP-адрес',
          },
          {
            key: 'user_login',
            title: 'Логин пользователя',
          },
          {
            key: 'fio',
            title: 'ФИО',
          },
          {
            key: 'action_name',
            title: 'Действие',
          },
          {
            key: 'content_type_name',
            title: 'Объект системы',
          },
          {
            key: 'entity_id',
            title: 'ID записи',
          },
          {
            key: 'repr',
            title: 'Номер/Наименование',
            dashIfEmpty: true,
          },
          {
            key: 'structure_name',
            title: 'Подразделение',
          },
        ],
      },
      processed: {
        sort: {
          field: 'action_at',
          reverse: true,
        },
      },
    },
  };
};
