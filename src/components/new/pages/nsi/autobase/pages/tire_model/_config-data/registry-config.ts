import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import tireModelPermissions from './permissions';

export const registryKey = 'tireModelRegistry';

export const getToConfig = (): TypeConfigData<TireModel> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tire_model',
      },
      removeOneData: {
        entity: 'autobase/tire_model',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Модели шин',
      buttons: [
        buttonsTypes.columns_control,
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
          title: 'Модель шины',
          type: 'multiselect',
        },
        {
          valueKey: 'tire_manufacturer_id',
          labelKey: 'tire_manufacturer_name',
          title: 'Производитель шины',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: tireModelPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'tire_model_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Модель шины',
            width: 400,
          },
          {
            key: 'tire_manufacturer_name',
            title: 'Производитель шины',
            width: 400,
          },
        ],
      },
    },
  };
};
