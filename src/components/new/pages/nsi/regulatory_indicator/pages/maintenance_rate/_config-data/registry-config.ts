import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelRatesPermissions from './permissions';
import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

export const registryKey = 'MaintenanceRateRegistry';

export const getToConfig = (): TypeConfigData<MaintenanceRate> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'maintenance_rate',
        payload: {
          type: 'odh',
        },
      },
      removeOneData: {
        entity: 'maintenance_rate',
        uniqKeyLikeQueryString: false,
      },
      getBlobData: {
        entity: 'maintenance_rate',
        payload: {
          format: 'xls',
          type: 'odh',
        },
      },
    },
    registryKey,
    header: {
      title: 'Нормы на содержание объектов',
      format: 'select_odh/dt(disabled)',
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
          valueKey: 'okrug_name',
          title: 'Округ',
          type: 'multiselect',
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: 'Организация',
          type: 'multiselect',
        },
        {
          valueKey: 'technical_operation_id',
          labelKey: 'technical_operation_name',
          title: 'Технологическая операция',
          type: 'multiselect',
        },
        {
          valueKey: 'maintenance_work_id',
          labelKey: 'maintenance_work_name',
          title: 'Наименование регламентной работы',
          type: 'multiselect',
        },
        {
          valueKey: 'season_id',
          labelKey: 'season_name',
          title: 'Сезон',
          type: 'multiselect',
        },
        {
          valueKey: 'clean_category_id',
          labelKey: 'clean_category_name',
          title: 'Категория',
          type: 'multiselect',
        },
        {
          valueKey: 'clean_subcategory_id',
          labelKey: 'clean_subcategory_name',
          title: 'Подкатегория',
          type: 'multiselect',
        },
        {
          valueKey: 'value',
          title: 'Норма',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'measure_unit_id',
          labelKey: 'measure_unit_name',
          title: 'Единица измерения',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: fuelRatesPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'maintenance_rates_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'okrug_name',
            title: 'Округ',
            width: 150,
          },
          {
            key: 'company_name',
            title: 'Организация',
            width: 200,
          },
          {
            key: 'technical_operation_name',
            title: 'Технологическая операция',
          },
          {
            key: 'maintenance_work_name',
            title: 'Наименование регламентной работы',
          },
          {
            key: 'season_name',
            title: 'Сезон',
          },
          {
            key: 'clean_category_name',
            title: 'Категория',
          },
          {
            key: 'clean_subcategory_name',
            title: 'Подкатегория',
          },
          {
            key: 'value',
            title: 'Норма',
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
          },
        ],
      },
    },
  };
};
