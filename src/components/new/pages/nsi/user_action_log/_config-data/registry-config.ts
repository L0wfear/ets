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
      format: 'datetime_range_picker',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'company_name',
          title: [
            {
              title: 'Учреждение',
              displayIf: displayIfContant.isOkrug,
            },
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'timestamp',
          title: 'Дата действия',
          type: 'advanced-date',
        },
        {
          valueKey: 'user_login',
          title: 'Логин пользователя',
          type: 'multiselect',
        },
        {
          valueKey: 'remote_ip',
          title: 'IP адрес',
          type: 'multiselect',
        },
        {
          valueKey: 'entity_number',
          title: 'Номер документа',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'action_name',
          title: 'Действие',
          type: 'multiselect',
        },
        {
          title: 'ФИО',
          valueKey: 'fio',
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
            key: 'company_name',
            title: [
              {
                title: 'Учреждение',
                displayIf: displayIfContant.isOkrug,
              },
            ],
          },
          {
            key: 'timestamp',
            title: 'Дата действия',
            format: 'datetime',
          },
          {
            key: 'user_login',
            title: 'Логин пользователя',
          },
          {
            key: 'remote_ip',
            title: 'IP адрес',
          },
          {
            key: 'entity_number',
            title: 'Номер документа',
          },
          {
            key: 'action_name',
            title: 'Действие',
          },
          {
            key: 'fio',
            title: 'ФИО',
          },
          {
            key: 'structure_name',
            title: 'Подразделение',
          },
        ],
      },
      processed: {
        sort: {
          field: 'timestamp',
          reverse: true,
        },
      },
    },
  };
};
