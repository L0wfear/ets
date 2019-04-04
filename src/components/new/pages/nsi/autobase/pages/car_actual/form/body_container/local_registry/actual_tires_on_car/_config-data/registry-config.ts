import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import tirePermissions from './permissions';

export const registryKey = 'tireRegistry';

export const getToConfig = (car_id): TypeConfigData<Tire> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/actual_tires_on_car',
        payload: {
          car_id,
        },
      },
    },
    registryKey,
    header: {
      title: 'Реестр шин',
      buttons: [],
    },
    filter: {
      fields: [
        {
          valueKey: 'tire_model_id',
          labelKey: 'tire_model_name',
          title: 'Модель шины',
          type: 'multiselect',
        },
        {
          valueKey: 'installed_at',
          title: 'Дата монтажа',
          type: 'advanced-date',
        },
        {
          valueKey: 'tire_size_id',
          labelKey: 'tire_size_name',
          title: 'Размер',
          type: 'multiselect',
        },
        {
          valueKey: 'odometr_diff',
          title: 'Пробег, км',
          type: 'advanced-number',
        },
        {
          valueKey: 'motohours_diff',
          title: 'Наработка, мч',
          type: 'advanced-number',
        },
      ],
    },
    list: {
      permissions: tirePermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'actual_tires_on_car_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'tire_model_name',
            title: 'Модель шины',
            width: 200,
          },
          {
            key: 'installed_at',
            title: 'Дата монтажа',
            width: 150,
            format: 'date',
          },
          {
            key: 'tire_size_name',
            title: 'Размер',
            width: 150,
          },
          {
            key: 'odometr_diff',
            title: 'Пробег, км',
            width: 150,
          },
          {
            key: 'motohours_diff',
            title: 'Наработка, мч',
            width: 150,
          },
        ],
      },
    },
  };
};
