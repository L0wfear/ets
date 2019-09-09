import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TechMaintenance } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import techMaintenancePermissions from './permissions';

export const registryKey = 'techMaintenanceRegistry';

export const getToConfig = (car_id: number): TypeConfigData<TechMaintenance> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tech_maintenance_registry',
        payload: {
          car_id,
        },
      },
      getBlobData: {
        entity: 'autobase/tech_maintenance_registry',
        payload: {
          car_id,
          format: 'xls',
        },
      },
      removeOneData: {
        entity: 'autobase/tech_maintenance_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Тех. обслуживание',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.create,
        buttonsTypes.read,
        buttonsTypes.remove,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'repair_company_name',
          title: 'Исполнитель ремонта',
          type: 'multiselect',
        },
        {
          valueKey: 'tech_maintenance_orders_text',
          title: 'Регламент ТО',
          type: 'multiselect',
        },
        {
          valueKey: 'number',
          title: 'Номер документа',
          type: 'multiselect',
        },
        {
          valueKey: 'plan_date_start',
          title: 'Плановая дата начала',
          type: 'advanced-date',
        },
        {
          valueKey: 'plan_date_end',
          title: 'Плановая дата окончания',
          type: 'advanced-date',
        },
        {
          valueKey: 'fact_date_start',
          title: 'Фактическая дата начала',
          type: 'advanced-date',
        },
        {
          valueKey: 'fact_date_end',
          title: 'Фактическая дата окончания',
          type: 'advanced-date',
        },
        {
          valueKey: 'odometr_fact',
          title: 'Пробег на момент ТО, км',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'motohours_fact',
          title: 'Счетчик м/ч на момент ТО, м/ч',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'note',
          title: 'Примечание',
          type: 'advanced-date',
        },
      ],
    },
    list: {
      permissions: techMaintenancePermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'tech_maintenance_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'repair_company_name',
            title: 'Исполнитель ремонта',
            width: 200,
          },
          {
            key: 'tech_maintenance_orders_text',
            title: 'Регламент ТО',
            width: 200,
          },
          {
            key: 'number',
            title: 'Номер документа',
            width: 200,
          },
          {
            key: 'plan_date_start',
            title: 'Плановая дата начала',
            width: 200,
            format: 'date',
          },
          {
            key: 'plan_date_end',
            title: 'Плановая дата окончания',
            width: 200,
            format: 'date',
          },
          {
            key: 'fact_date_start',
            title: 'Фактическая дата начала',
            width: 200,
            format: 'date',
          },
          {
            key: 'fact_date_end',
            title: 'Фактическая дата окончания',
            width: 200,
            format: 'date',
          },
          {
            key: 'odometr_fact',
            title: 'Пробег на момент ТО, км',
            width: 200,
          },
          {
            key: 'motohours_fact',
            title: 'Счетчик м/ч на момент ТО, м/ч',
            width: 200,
          },
          {
            key: 'note',
            title: 'Примечание',
            width: 200,
          },
        ],
      },
    },
  };
};
