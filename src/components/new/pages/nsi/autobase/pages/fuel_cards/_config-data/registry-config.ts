import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelCardsPermissions from './permissions';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const uniqKeyForParams = 'fuel_cards_registry_id';
export const registryKey = 'fuelCardsRegistry';

export const getToConfig = (is_archive: boolean = false, title: string = 'Реестр топливных карт', regKey = registryKey): TypeConfigData<FuelCard> => {
  let buttons: TypeConfigData<FuelCard>['header']['buttons'] = [
    buttonsTypes.columns_control,
    buttonsTypes.filter,
    buttonsTypes.fuel_card_create,
    buttonsTypes.read,
    buttonsTypes.remove,
    buttonsTypes.fuel_card_to_archive,
    buttonsTypes.export,
  ];

  if (is_archive) {
    buttons = [
      buttonsTypes.columns_control,
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
    registryKey: regKey,
    header: {
      title,
      buttons,
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_name',
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'company_name',
          title: [
            {
              title: 'Организация',
              displayIf: displayIfContant.isKgh,
            }
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'number',
          title: 'Номер',
          type: 'multiselect',
        },
        {
          valueKey: 'status_text',
          title: 'Статус',
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
          valueKey: 'gov_number_text',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'garage_number',
          title: 'Гаражный номер',
          type: 'multiselect',
        },
        {
          valueKey: 'fuel_type_text',
          title: 'Тип топлива',
          type: 'multiselect',
        },
        {
          valueKey: 'source_type_id',
          labelKey: 'source_type_text',
          title: 'Способ создания',
          type: 'multiselect',
        },
        {
          valueKey: 'refill_sum',
          title: 'Сумма заправок',
          type: 'advanced-number',
          step: 1,
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
        uniqKeyForParams,
        uniqKeyForSelect: 'composite_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'okrug_name',
            title: [
              {
                title: 'Округ',
                displayIf: displayIfContant.isKgh,
              }
            ],
            width: 150,
          },
          {
            key: 'company_name',
            title: [
              {
                title: 'Организация',
                displayIf: displayIfContant.isKgh,
              }
            ],
            width: 200,
          },
          {
            key: 'number',
            title: 'Номер',
            width: 200,
          },
          {
            key: 'status_text',
            title: 'Статус',
            width: 200,
          },
          {
            key: 'released_at',
            title: 'Дата выпуска',
            format: 'date',
            width: 200,
          },
          {
            key: 'date_end',
            title: 'Дата окончания срока действия',
            format: 'date',
            width: 200,
          },
          {
            key: 'fuel_type_text',
            title: 'Тип топлива',
            width: 150,
          },
          {
            key: 'gov_number_text',
            title: 'Рег. номер ТС',
            width: 200,
            defaultValue: 'Малая механизация',
          },
          {
            key: 'garage_number',
            title: 'Гаражный номер',
            width: 200,
          },
          {
            key: 'source_type_text',
            title: 'Способ создания',
            width: 200,
          },
          {
            key: 'refill_sum_text',
            title: 'Сумма заправок',
            width: 200,
          },
          {
            key: 'structure_name',
            title: 'Подразделение',
            width: 200,
          },
        ],
      },
    },
  };
};
