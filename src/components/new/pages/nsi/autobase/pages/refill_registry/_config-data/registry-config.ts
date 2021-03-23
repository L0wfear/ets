import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';
import refillPermissions from 'components/new/pages/nsi/autobase/pages/refill_registry/_config-data/permissions';

export const registryKey = 'Refill';

export const getToConfig = (): TypeConfigData<Refill> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'refill_registry',
        userServerFilters: true,
        payload: {
          sort_by: 'refill_at:desc'
        }
      },
    },
    registryKey,
    header: {
      title: 'Реестр заправок',
      titlePopover: 'Реестр формируется на основе данных, полученных в рамках интеграции с топливной компанией.',

      buttons: [
        buttonsTypes.columns_control,
        buttonsTypes.filter,
        buttonsTypes.read,
        buttonsTypes.refill_print,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_id',
          labelKey: 'okrug_name',
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          type: 'multiselect',
          makeOptionsFromSessionData: {
            groupName: 'okrugs',
            valueKey: 'id',
            labelKey: 'name',
          }
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
          ],
          type: 'multiselect',
          makeOptionsFromSessionData: {
            groupName: 'companies',
            valueKey: 'asuods_id',
            labelKey: 'name',
          }
        },
        {
          valueKey: 'refill_at',
          title: 'Дата и время транзакции',
          type: 'advanced-datetime',
        },
        {
          valueKey: 'fuel_card_number',
          title: 'Номер топливной карты ГПН',
          type: 'multiselect',
          getRegistryData: {
            entity: 'fuel_cards',
            valueKey: 'number',
            labelKey: 'number',
            groupName: 'fuel_cards',
            payload: {
              fuel_type_id: 2
            }
          },
        },
        {
          valueKey: 'fuel_type_id',
          title: 'Тип топлива',
          type: 'multiselect',
          getRegistryData: {
            entity: 'fuel_type',
            valueKey: 'id',
            labelKey: 'name',
            payload: {
              is_fuel_card: true,
            }
          },
        },
        {
          valueKey: 'fuel_given',
          title: 'Выдано, л',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'car_gov_number_text',
          title: 'Рег. номер ТС',
          type: 'multiselect',
          getRegistryData: {
            entity: 'filters/refill_registry/cars',
            groupName: 'filters/refill_registry/cars',
            valueKey: 'gov_number',
            labelKey: 'gov_number',
          },
        },
        {
          valueKey: 'waybill_id',
          labelKey: 'waybill_number',
          title: 'Путевой лист',
          type: 'multiselect',
        },
        {
          valueKey: 'wb_fuel_card_ids',
          title: 'Номер топливной карты, указанной в ПЛ',
          type: 'multiselect',
          getRegistryData: {
            entity: 'fuel_cards',
            valueKey: 'id',
            labelKey: 'number',
            groupName: 'fuel_cards',
            payload: {
              fuel_type_id: 2
            }
          },
        },
        {
          valueKey: 'wb_fuel_types',
          title: 'Тип топлива, указанный в ПЛ',
          type: 'multiselect',
          getRegistryData: {
            entity: 'fuel_cards',
            valueKey: 'fuel_type',
            labelKey: 'fuel_type_text',
            groupName: 'fuel_cards',
          },
        },
        {
          valueKey: 'gas_station_name',
          title: 'Наименование АЗС',
          type: 'multiselect',
          getRegistryData: {
            entity: 'gas_station',
            valueKey: 'id',
            labelKey: 'name',
            groupName: 'gas_station',
          },
        },
        {
          valueKey: 'gas_station_address',
          title: 'Адрес АЗС',
          type: 'multiselect',
          getRegistryData: {
            entity: 'gas_station',
            valueKey: 'id',
            labelKey: 'address',
            groupName: 'gas_station',
          },
        },
        {
          valueKey: 'structure_id',
          labelKey: 'structure_name',
          type: 'multiselect',
          title: [
            {
              displayIf: displayIfContant.lenghtStructureMoreOne,
              title: 'Подразделение',
            },
          ],
          getRegistryData: {
            entity: 'company_structure',
            payload: {
              linear: true,
            },
            typeAns: 'result',
            valueKey: 'id',
            labelKey: 'name',
          },
        },
      ],
    },
    list: {
      permissions: refillPermissions,
      data: {
        uniqKey: 'tx_id',
        fixedWidth: true,
        uniqKeyForParams: 'tx_id',
        uniqKeyType: 'string',
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
            key: 'refill_at',
            title: 'Дата и время транзакции',
            format: 'datetime',
            width: 150,
          },
          {
            key: 'fuel_card_number',
            title: 'Номер топливной карты ГПН',
            width: 150,
          },
          {
            key: 'fuel_type',
            title: 'Тип топлива',
            width: 150,
          },
          {
            key: 'fuel_given',
            title: 'Выдано, л',
            width: 150,
          },
          {
            key: 'car_gov_number_text',
            title: 'Рег. номер ТС',
            width: 150,
            fieldTitlePopup: 'Рег.номер указан в соответствии с ТС, указанным в топливной карте в блоке "Привязка ТС" на дату проведения транзакции.',
          },
          {
            key: 'waybill_number',
            title: 'Путевой лист',
            width: 150,
          },
          {
            key: 'wb_fuel_card_numbers',
            title: 'Номер топливной карты, указанной в ПЛ',
            width: 150,
            sortable: false,
          },
          {
            key: 'wb_fuel_types_text',
            title: 'Тип топлива, указанный в ПЛ',
            width: 150,
            sortable: false,
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
