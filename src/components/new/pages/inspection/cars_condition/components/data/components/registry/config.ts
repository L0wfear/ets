import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const registryKey = 'inspectionCarsCondition';

export const getInspectionCarsConditionDataRegistryConfig = (searchState: any): TypeConfigData<InspectCarsCondition> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspect/registry',
        payload: {
          company_id: searchState.companyId,
          type: 'cars_condition',
        },
      },
      getBlobData: {
        entity: 'inspect/registry',
        payload: {
          company_id: searchState.companyId,
          type: 'cars_condition',
          format: 'xls',
        },
      },
    },
    registryKey,
    header: {
      title: 'Журнал проверок',
      buttons: [
        buttonsTypes.inspect_show_acts,
        buttonsTypes.filter,
        buttonsTypes.read,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
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
          valueKey: 'monitoring_kind',
          labelKey: 'monitoring_kind_text',
          type: 'multiselect',
          title: 'Вид проверки',
        },
        {
          valueKey: 'status',
          labelKey: 'status_text',
          type: 'multiselect',
          title: 'Статус проверки',
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_name',
          type: 'multiselect',
          title: 'Организация',
        },
        {
          valueKey: 'cars_cnt',
          type: 'advanced-number',
          title: 'Количество ТС на балансе',
          step: 1,
        },
        {
          valueKey: 'checked_cars_cnt',
          type: 'advanced-number',
          title: 'Проверено ТС',
          step: 1,
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
            key: 'enumerated',
            title: '№',
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
            title: 'Вид проверки',
            width: 200,
          },
          {
            key: 'status_text',
            title: 'Статус проверки',
            width: 200,
          },
          {
            key: 'company_name',
            title: 'Организация',
            width: 200,
          },
          {
            key: 'cars_cnt',
            title: 'Количество ТС на балансе',
            width: 250,
          },
          {
            key: 'checked_cars_cnt',
            title: 'Проверено ТС',
            width: 150,
          },
        ],
      },
    },
  };
};
