import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelRatesPermissions from './permissions';
import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';

export const registryKey = 'FuelConsumptionRateRegistry';

export const getToConfig = (): TypeConfigData<FuelRate> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'fuel_consumption_rates',
      },
      removeOneData: {
        entity: 'fuel_consumption_rates',
        uniqKeyLikeQueryString: true,
      },
    },
    registryKey,
    header: {
      title: 'Нормы расхода топлива',
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
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Учреждение',
            },
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'order_date',
          title: 'Дата приказа',
          type: 'advanced-date',
        },
        {
          valueKey: 'operation_name',
          title: 'Операция',
          type: 'multiselect',
        },
        {
          valueKey: 'measure_unit_id',
          labelKey: 'measure_unit_name',
          title: 'Единица измерения',
          type: 'multiselect',
        },
        {
          valueKey: 'summer_rate',
          title: 'Норма для летнего периода',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'winter_rate',
          title: 'Норма для зимнего периода',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'car_special_model_id',
          labelKey: 'car_special_model_name',
          title: 'Модель ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'model_name',
          title: 'Марка шасси ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'operation_equipment',
          title: 'Для спецоборудования',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
        },
        {
          valueKey: 'company_structure_id',
          labelKey: 'company_structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
        {
          valueKey: 'is_excluding_mileage',
          title: 'Без учета пробега',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
        },
      ],
    },
    list: {
      permissions: fuelRatesPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'fuel_consumption_rates_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'company_name',
            title: [
              {
                displayIf: displayIfContant.isOkrug,
                title: 'Учреждение',
              },
            ],
            width: 200,
          },
          {
            key: 'order_date',
            title: 'Дата приказа',
            format: 'date',
            width: 150,
          },
          {
            key: 'operation_name',
            title: 'Операция',
            width: 200,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
          {
            key: 'comment',
            title: 'Примечание',
            width: 200,
          },
          {
            key: 'summer_rate',
            title: 'Норма для летнего периода',
            width: 250,
          },
          {
            key: 'winter_rate',
            title: 'Норма для зимнего периода',
            width: 250,
          },
          {
            key: 'car_special_model_name',
            title: 'Модель ТС',
            width: 200,
          },
          {
            key: 'full_model_name',
            title: 'Марка шасси ТС',
            width: 200,
          },
          {
            key: 'operation_equipment',
            title: 'Для спецоборудования',
            width: 200,
            format: 'boolean',
          },
          {
            key: 'company_structure_name',
            title: 'Подразделение',
            width: 200,
          },
          {
            key: 'is_excluding_mileage',
            title: 'Без учета пробега',
            format: 'boolean',
            width: 200,
          },
        ],
      },
    },
  };
};
