import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import batteryBrandPermissions from './permissions';

export const registryKey = 'batteryBrandRegistry';

export const getToConfig = (): TypeConfigData<BatteryBrand> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/battery_brand',
      },
      removeOneData: {
        entity: 'autobase/battery_brand',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Марки аккумуляторов',
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
          valueKey: 'name',
          title: 'Марка аккумулятора',
          type: 'multiselect',
        },
        {
          valueKey: 'manufacturer_id',
          labelKey: 'manufacturer_name',
          title: 'Производитель аккумулятора',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: batteryBrandPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'battery_brand_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Марка аккумулятора',
            width: 400,
          },
          {
            key: 'manufacturer_name',
            title: 'Производитель аккумулятора',
            width: 400,
          },
        ],
      },
    },
  };
};
