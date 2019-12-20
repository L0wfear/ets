import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import fuelCardsPermissions from './permissions';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'fuelCardsRegistry';

export const getToConfig = (): TypeConfigData<FuelCard> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'fuel_cards',
      },
    },
    registryKey,
    header: {
      title: 'Реестр топливных карт',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.create,
        buttonsTypes.read,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'number',
          title: 'Номер',
          type: 'multiselect',
        },
        {
          valueKey: 'released_at',
          type: 'advanced-date',
          title: 'Дата выпуска',
        },
        {
          valueKey: 'date_end',
          type: 'advanced-date',
          title: 'Дата окончания срока действия',
        },
        {
          valueKey: 'fuel_type_text',
          title: 'Тип топлива',
          type: 'multiselect',
        },
        {
          valueKey: 'structure_id',
          labelKey: 'structure_name',
          title: 'Подразделение',
          type: 'multiselect',
          displayIf: displayIfContant.lenghtStructureMoreOne,
        },
        {
          valueKey: 'company',
          title: 'Организация',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: fuelCardsPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'fuel_cards_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'number',
            title: 'Номер',
            width: 200,
          },
          {
            key: 'released_at',
            title: 'Дата выпуска',
            format: 'datetime',
            width: 200,
          },
          {
            key: 'date_end',
            title: 'Дата окончания срока действия',
            format: 'datetime',
            width: 200,
          },
          {
            key: 'fuel_type_text',
            title: 'Тип топлива',
            width: 150,
          },
          {
            key: 'structure_name',
            title: 'Подразделение',
            width: 200,
          },
          {
            key: 'company',
            title: 'Организация',
            width: 300,
          },
        ],
      },
    },
  };
};
