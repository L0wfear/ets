import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';
import refillPermissions from 'components/new/pages/nsi/autobase/pages/refill_registry/_config-data/permissions';

export const registryKey = 'Refill';

export const getToConfig = (fuel_card_number: string): TypeConfigData<Refill> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'refill_registry',
        userServerFilters: true,
      },
      getBlobData: {
        entity: 'refill_registry/export',
      },
    },
    registryKey,
    header: {
      title: 'Реестр заправок',

      buttons: [
        buttonsTypes.read,
        buttonsTypes.export_filtred_data,
      ],
    },
    list: {
      permissions: refillPermissions,
      data: {
        uniqKey: 'rrn_code',
        fixedWidth: true,
        uniqKeyForParams: 'rrn_code',
        uniqKeyType: 'string',
        withoutWithSearch: true,
      },
      processed: {
        filterValues: {
          fuel_card_number__in: [fuel_card_number]
        }
      },
      meta: {
        fields: [
          {
            key: 'refill_at',
            title: 'Дата и время транзакции',
            format: 'datetime',
            width: 150,
          },
          {
            key: 'fuel_type',
            title: 'Тип топлива ГПН',
            width: 150,
          },
          {
            key: 'fuel_given',
            title: 'Выдано, л',
            width: 150,
          },
          {
            key: 'car_gov_number',
            title: 'Рег. номер ТС',
            width: 150,
          },
          {
            key: 'waybill_number',
            title: 'Путевой лист',
            width: 150,
          },
          {
            key: 'gas_station_name',
            title: 'Наименование АЗС',
            width: 150,
          },
          {
            key: 'gas_station_address',
            title: 'Адрес АЗС',
            width: 150,
          },
        ],
      },
    },
  };
};
