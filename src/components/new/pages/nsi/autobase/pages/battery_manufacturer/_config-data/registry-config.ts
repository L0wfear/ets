import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import batteryManufacturerPermissions from './permissions';

export const registryKey = 'batteryManufacturerRegistry';

export const getToConfig = (): TypeConfigData<BatteryManufacturer> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/battery_manufacturer',
      },
      removeOneData: {
        entity: 'autobase/battery_manufacturer',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Производители аккумуляторов',
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
          title: 'Производитель аккумулятора',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: batteryManufacturerPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'battery_manufacturer_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Производитель аккумулятора',
            width: 400,
          },
        ],
      },
    },
  };
};
