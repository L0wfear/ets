import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelCardsPermissions from './permissions';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'fuelCardsRegistry';

export const getToConfig = (is_archive: boolean = false, title: string = 'Реестр топливных карт'): TypeConfigData<FuelCard> => {
  let buttons: TypeConfigData<FuelCard>['header']['buttons'] = [
    buttonsTypes.filter,
    buttonsTypes.create,
    buttonsTypes.read,
    buttonsTypes.remove,
    buttonsTypes.fuel_card_to_archive,
    buttonsTypes.export,
  ];

  if (is_archive) {
    buttons = [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.fuel_card_from_archive,
      buttonsTypes.export,
    ];
  }

  return {
    Service: {
      getRegistryData: {
        entity: 'fuel_cards',
        payload: {
          is_archive,
        },
      },
      getBlobData: {
        entity: 'fuel_cards',
        payload: {
          format: 'xls',
          is_archive,
        },
      }
    },
    registryKey,
    header: {
      title,
      buttons,
    },
    filter: {
      fields: [
        {
          valueKey: 'number',
          title: 'Номер',
          type: 'multiselect',
        },
        {
          valueKey: 'fuel_type_text',
          title: 'Тип топлива',
          type: 'multiselect',
        },
        {
          valueKey: 'is_common',
          title: 'Общая',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
        },
        {
          valueKey: 'structure_id',
          labelKey: 'structure_name',
          title: 'Подразделение',
          type: 'multiselect',
          displayIf: displayIfContant.lenghtStructureMoreOne,
        },
        {
          valueKey: 'company_short_name',
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
            key: 'fuel_type_text',
            title: 'Тип топлива',
            width: 150,
          },
          {
            key: 'is_common',
            title: 'Общая',
            format: 'boolean',
            width: 100,
          },
          {
            key: 'structure_name',
            title: 'Подразделение',
            width: 200,
          },
          {
            key: 'company_short_name',
            title: 'Организация',
            width: 300,
          },
        ],
      },
    },
  };
};
