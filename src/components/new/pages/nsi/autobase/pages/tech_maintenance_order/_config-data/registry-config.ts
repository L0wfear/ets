import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import techMaintenanceOrderPermissions from './permissions';
import {
  IS_NOT_SELECT_OPTIONS,
  TIME_MEASURES_SELECT_OPTIONS,
} from 'constants/dictionary';

export const registryKey = 'techMaintenanceOrderRegistry';

export const getToConfig = (): TypeConfigData<TechMaintOrder> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tech_maintenance_order_registry',
      },
      removeOneData: {
        entity: 'autobase/tech_maintenance_order_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр регламентов ТО',
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
          valueKey: 'tech_maintenance_type_name',
          title: 'Тип ТО',
          type: 'multiselect',
        },
        {
          valueKey: 'sequence',
          title: 'Последовательность ТО',
          type: 'multiselect',
          // options: SEQUENCE_1_TO_20_SELECT_OPTIONS,
        },
        {
          valueKey: 'description',
          title: 'Описание',
          type: 'advanced-string-like',
        },
        {
          valueKey: 'car_model_name',
          title: 'Модель ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'is_periodic',
          title: 'Признак периодического ТО',
          type: 'multiselect',
          options: IS_NOT_SELECT_OPTIONS,
        },
        {
          valueKey: 'interval_probeg',
          title: 'Интервал до следующего ТО (по пробегу)',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'measure_unit_run_name',
          title: 'Пробег измеряется',
          type: 'multiselect',
        },
        {
          valueKey: 'interval_time',
          title: 'Интервал до следующего ТО (по времени)',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'interval_time_type',
          title: 'Время измеряется',
          type: 'multiselect',
          options: TIME_MEASURES_SELECT_OPTIONS,
        },
      ],
    },
    list: {
      permissions: techMaintenanceOrderPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'tech_maintenance_order_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'tech_maintenance_type_name',
            title: 'Тип ТО',
            width: 100,
          },
          {
            key: 'sequence',
            title: 'Последовательность ТО',
            width: 225,
          },
          {
            key: 'description',
            title: 'Описание',
            width: 200,
          },
          {
            key: 'car_model_name',
            title: 'Модель ТС',
            width: 150,
          },
          {
            key: 'is_periodic',
            title: 'Признак периодического ТО',
            format: 'boolean',
            width: 175,
          },
          {
            key: 'interval_probeg',
            title: 'Интервал до следующего ТО (по пробегу)',
            width: 200,
          },
          {
            key: 'measure_unit_run_name',
            title: 'Пробег измеряется',
            width: 150,
          },
          {
            key: 'interval_time',
            title: 'Интервал до следующего ТО (по времени)',
            width: 200,
          },
          {
            key: 'interval_time_type',
            title: 'Время измеряется',
            format: 'TIME_MEASURES',
            width: 175,
          },
        ],
      },
    },
  };
};
