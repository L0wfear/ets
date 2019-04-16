import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import batteryRegistryPermissions from './permissions';

export const registryKey = 'batteryRegistryRegistry';

export const getToConfig = (car_id: number): TypeConfigData<BatteryRegistry> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/actual_batteries_on_car',
        payload: {
          car_id,
        },
      },
      removeOneData: {
        entity: 'autobase/actual_batteries_on_car',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр аккумуляторов',
      buttons: [],
    },
    filter: {
      fields: [
        {
          valueKey: 'brand_id',
          labelKey: 'brand_name',
          title: 'Марка аккумулятора',
          type: 'multiselect',
        },
        {
          valueKey: 'serial_number',
          title: 'Серийный номер',
          type: 'multiselect',
        },
        {
          valueKey: 'lifetime_months',
          title: 'Срок службы',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'worked_months',
          title: 'Количество месяцев наработки',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'manufacturer_id',
          labelKey: 'manufacturer_name',
          title: 'Изготовитель',
          type: 'multiselect',
        },
        {
          valueKey: 'released_at',
          title: 'Дата выпуска',
          type: 'advanced-date',
        },
        {
          valueKey: 'installed_at',
          title: 'Дата установки',
          type: 'advanced-date',
        },
      ],
    },
    list: {
      permissions: batteryRegistryPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'actual_batteries_on_car_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'brand_name',
            title: 'Марка аккумулятора',
            width: 200,
          },
          {
            key: 'serial_number',
            title: 'Серийный номер',
            width: 200,
          },
          {
            key: 'lifetime_months',
            title: 'Срок службы',
            width: 150,
          },
          {
            key: 'worked_months',
            title: 'Количество месяцев наработки',
            width: 300,
          },
          {
            key: 'manufacturer_name',
            title: 'Изготовитель',
            width: 200,
          },
          {
            key: 'released_at',
            title: 'Дата выпуска',
            format: 'date',
            width: 150,
          },
          {
            key: 'installed_at',
            title: 'Дата установки',
            format: 'date',
            width: 150,
          },
        ],
      },
    },
  };
};
