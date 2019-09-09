import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelRatesPermissions from './permissions';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

export const registryKey = 'MaterialConsumptionRateRegistry';

export const getToConfig = (): TypeConfigData<MaterialConsumptionRate> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'material_consumption_rate',
      },
      removeOneData: {
        entity: 'material_consumption_rate',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Справочник норм на расход расходных материалов',
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
          valueKey: 'technical_operation_id',
          labelKey: 'technical_operation_name',
          title: 'Технологическая операция',
          type: 'multiselect',
        },
        {
          valueKey: 'consumable_material_id',
          labelKey: 'consumable_material_name',
          title: 'Расходный материал',
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
          step: 0.001,
        },
      ],
    },
    list: {
      permissions: fuelRatesPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'material_consumption_rates_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'technical_operation_name',
            title: 'Технологическая операция',
            width: 250,
          },
          {
            key: 'consumable_material_name',
            title: 'Расходный материал',
            width: 200,
          },
          {
            key: 'season_name',
            title: 'Сезон',
            width: 100,
          },
          {
            key: 'clean_category_name',
            title: 'Категория',
            width: 100,
          },
          {
            key: 'clean_subcategory_name',
            title: 'Подкатегория',
            width: 200,
          },
          {
            key: 'value',
            title: 'Норма',
            width: 100,
            format: 'toFixed3',
          },
        ],
      },
    },
  };
};
