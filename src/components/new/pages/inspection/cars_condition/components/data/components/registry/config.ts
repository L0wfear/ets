import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { InspectionPayload } from 'components/new/pages/inspection/common_components/data/@types/InspectionData';

export const registryKey = 'inspectionCarsCondition';

export const getInspectionCarsConditionDataRegistryConfig = (payload: InspectionPayload, searchState: object): TypeConfigData<InspectCarsCondition> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspection/cars_condition',
        payload: {
          ...payload
        },
      },
      getBlobData: {
        entity: 'inspection/cars_condition/export',
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
        buttonsTypes.export_filtred_data,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'company_id',
          labelKey: 'company_short_name',
          type: 'multiselect',
          title: 'Организация',
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
          valueKey: 'monitoring_kind',
          labelKey: 'monitoring_kind_text',
          type: 'multiselect',
          title: 'Вид мониторинга',
        },
        {
          valueKey: 'checks_period',
          labelKey: 'checks_period_text',
          type: 'multiselect',
          title: 'Период проверки',
        },
        {
          valueKey: 'checks_type',
          labelKey: 'checks_type_text',
          type: 'multiselect',
          title: 'Тип проверки',
        },
        {
          valueKey: 'cars_cnt',
          type: 'advanced-number',
          title: 'Количество ТС на балансе',
          step: 1,
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
        uniqKeyForParams: 'id', // @todo
        fixedWidth: true,
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
            key: 'company_short_name',
            title: 'Организация',
            width: 200,
          },
          {
            key: 'date_start',
            title: 'Дата начала проверки',
            format: 'date',
            width: 200,
          },
          {
            key: 'date_end',
            title: 'Дата окончания проверки',
            format: 'date',
            width: 250,
          },
          {
            key: 'monitoring_kind_text',
            title: 'Вид мониторинга',
            width: 200,
          },
          {
            key: 'status_text',
            title: 'Статус проверки',
            width: 200,
          },
          {
            key: 'checks_period_text',
            title: 'Период проверки',
            width: 150,
            dashIfEmpty: true,
          },
          {
            key: 'checks_type_text',
            title: 'Тип проверки',
            width: 150,
          },
          {
            key: 'cars_cnt',
            title: 'Количество ТС на балансе',
            width: 250,
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
        ],
      },
    },
  };
};
