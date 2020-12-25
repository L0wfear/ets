import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelCardsPermissions from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/permissions';
import { FuelCardLog } from '../@types/FuelCardLogs';

export const registryKey = 'Logs';

export const getToConfig = (id: number): TypeConfigData<FuelCardLog> => {
  return {
    Service: {
      getRegistryData: {
        entity: `fuel_cards/${id}/logs`,
      },
    },
    registryKey,
    list: {
      permissions: fuelCardsPermissions,
      meta: {
        fields: [
          {
            key: 'action_at',
            title: 'Дата и время изменения',
            format: 'datetime',
            width: 250,
          },
          {
            key: 'source',
            title: 'Источник',
            width: 150,
          },
          {
            key: 'repr',
            title: 'Информация',
            width: 300,
          },
        ],
      },
    },
  };
};
