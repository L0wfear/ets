import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';
import refillPermissions from './permissions';

export const registryKey = 'Refill';

export const getToConfig = (): TypeConfigData<Refill> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'refill_registry',
        userServerFilters: true,
      },
    },
    registryKey,
    header: {
      title: 'Реестр заправок',

      buttons: [
        buttonsTypes.filter,
        buttonsTypes.read,
        buttonsTypes.refill_print,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_name',
          title: 'Округ',
          type: 'multiselect',
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: 'Организация',
          type: 'multiselect',
        },
        {
          valueKey: 'transaction_at',
          title: 'Дата и время транзакции',
          type: 'advanced-datetime',
        },
        {
          valueKey: 'number',
          title: 'Номер топливной карты ГПН',
          type: 'multiselect',
        },
        {
          valueKey: 'fuel_type_id',
          labelKey: 'fuel_type',
          title: 'Тип топлива ГПН',
          type: 'multiselect',
        },
        {
          valueKey: 'given',
          title: 'Выдано, л',
          type: 'multiselect',
        },
        {
          valueKey: 'gov_number',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'waybill_id',
          labelKey: 'waybill_number',
          title: 'Путевой лист',
          type: 'multiselect',
        },
        {
          valueKey: 'wb_fuel_card_number',
          title: 'Номер топливной карты, указанной в ПЛ',
          type: 'multiselect',
        },
        {
          valueKey: 'wb_fuel_type',
          title: 'Тип топлива, указанный в ПЛ',
          type: 'multiselect',
        },
        {
          valueKey: 'station_name',
          title: 'Наименование АЗС',
          type: 'multiselect',
        },
        {
          valueKey: 'station_address',
          title: 'Адрес АЗС',
          type: 'multiselect',
        },
        {
          valueKey: 'structure_id',
          labelKey: 'structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: refillPermissions,
      data: {
        uniqKey: 'rrn_code',
        fixedWidth: true,
        uniqKeyForParams: 'rrn_code',
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
            width: 150,
          },
          {
            key: 'transaction_at',
            title: 'Дата и время транзакции',
            format: 'datetime',
            width: 150,
          },
          {
            key: 'number',
            title: 'Номер топливной карты ГПН',
            width: 150,
          },
          {
            key: 'fuel_type',
            title: 'Тип топлива ГПН',
            width: 150,
          },
          {
            key: 'given',
            title: 'Выдано, л',
            width: 150,
          },
          {
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 150,
          },
          {
            key: 'waybill_number',
            title: 'Путевой лист',
            width: 150,
          },
          {
            key: 'wb_fuel_card_number',
            title: 'Номер топливной карты, указанной в ПЛ',
            width: 150,
          },
          {
            key: 'wb_fuel_type',
            title: 'Тип топлива, указанный в ПЛ',
            width: 150,
          },
          {
            key: 'station_name',
            title: 'Наименование АЗС',
            width: 150,
          },
          {
            key: 'station_address',
            title: 'Адрес АЗС',
            width: 150,
          },
          {
            key: 'structure_name',
            title: 'Подразделение',
            width: 150,
          },
        ],
      },
    },
  };
};
