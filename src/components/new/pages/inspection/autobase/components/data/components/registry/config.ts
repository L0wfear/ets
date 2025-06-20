import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { InspectionPayload } from 'components/new/pages/inspection/common_components/data/@types/InspectionData';

export const registryKey = 'inspectAutobase';

export const getInspectionAutobaseDataRegistryConfig = (payload: InspectionPayload, searchState: object): TypeConfigData<InspectAutobase> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspection/autobase',
        payload: {
          ...payload
        },
      },
      getBlobData: {
        entity: 'inspection/autobase/export',
      },
    },
    registryKey,
    header: {
      title: 'Журнал проверок',
      buttons: [
        buttonsTypes.inspect_show_acts,
        buttonsTypes.inspect_get_acts,
        buttonsTypes.filter,
        buttonsTypes.read,
        {
          id: `${registryKey}_remove`,
          type: buttonsTypes.remove,
          message_multi: 'Вы уверены, что хотите удалить выбранные проверки?',
          message_single: 'Вы уверены, что хотите удалить выбранную проверку?',
          paramsForDisabling: {
            status: 'deleted'
          }
        },
        buttonsTypes.export_filtred_data,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_id',
          labelKey: 'okrug_name',
          type: 'multiselect',
          title: 'Округ',
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_short_name',
          type: 'multiselect',
          title: 'Организация',
        },
        {
          valueKey: 'base_id',
          labelKey: 'base_address',
          type: 'multiselect',
          title: 'Автобаза',
        },
        {
          valueKey: 'date_start',
          type: 'advanced-date',
          title: 'Дата начала проверки',
        },
        {
          valueKey: 'date_end',
          type: 'advanced-date',
          title: 'Дата окончания проверки',
        },
        {
          valueKey: 'status',
          labelKey: 'status_text',
          type: 'multiselect',
          title: 'Статус проверки',
        },
        {
          valueKey: 'open_employee_fio',
          title: 'Открыта',
          type: 'multiselect',
        },
        {
          valueKey: 'close_employee_fio',
          title: 'Завершена',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'id', // todo сделать нормально
      },
      processed: {
        filterValues: {},
        sort: {
          field: 'status_text',
          reverse: true,
        },
      },
      meta: {
        fields: [
          {
            key: 'checkbox',
          },
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'okrug_name',
            title: 'Округ',
            width: 200,
          },
          {
            key: 'company_short_name',
            title: 'Организация',
            width: 200,
          },
          {
            key: 'base_address',
            title: 'Автобаза',
            width: 200,
          },
          {
            key: 'date_start',
            title: 'Дата начала проверки',
            format: 'date',
            width: 250,
          },
          {
            key: 'date_end',
            title: 'Дата окончания проверки',
            format: 'date',
            width: 250,
          },
          {
            key: 'status_text',
            title: 'Статус проверки',
            width: 200,
          },
          {
            key: 'open_employee_fio',
            title: 'Открыта',
            width: 200,
          },
          {
            key: 'close_employee_fio',
            title: 'Завершена',
            width: 200,
          },
          {
            key: 'delete_employee_fio',
            title: 'Удалена',
            width: 200,
            dashIfEmpty: true,
          },
        ],
      },
    },
  };
};
