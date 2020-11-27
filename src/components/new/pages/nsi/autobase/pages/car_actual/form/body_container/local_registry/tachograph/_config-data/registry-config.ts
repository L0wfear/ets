import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TachographsOnCar } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import tachographPermissions from './permissions';

export const registryKey = 'tachograph';

export const getToConfig = (car_id = 0): TypeConfigData<TachographsOnCar> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tachograph_on_car',
        payload: {
          car_id
        }
      },
    },
    registryKey,
    header: {
      title: 'Реестр тахографов',
    },
    list: {
      permissions: tachographPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        disableDoubleClick: true,
      },
      meta: {
        fields: [
          {
            key: 'tachograph_brand_name',
            title: 'Марка тахографа',
            width: 200,
          },
          {
            key: 'factory_number',
            title: 'Заводской номер тахографа',
            width: 200,
          },
          {
            key: 'installed_at',
            format: 'date',
            title: 'Дата монтажа',
            width: 200,
          },
          {
            key: 'activated_at',
            format: 'date',
            title: 'Дата активации',
            width: 200,
          },
          {
            key: 'uninstalled_at',
            format: 'date',
            title: 'Дата демонтажа',
            width: 200,
          },
        ],
      },
    },
  };
};
