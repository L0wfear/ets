import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import fuelOperationsPermissions from './permissions';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import { FuelOperationsService } from 'api/Services';

export const registryKey = 'fuelOperationsRegistry';

export const getToConfig = (): TypeConfigData<FuelOperationActive> => {
  return {
    Service: {
      getRegistryData: {
        entity: FuelOperationsService._path,
        payload: {
          is_active: true,
        },
      },
      removeOneData: {
        entity: FuelOperationsService._path,
        uniqKeyLikeQueryString: true,
      },
      getBlobData: {
        entity: FuelOperationsService._path,
        payload: {
          is_active: true,
          format: 'xls',
        },
      },
    },
    registryKey,
    header: {
      title: 'Операции для расчета топлива',
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
          valueKey: 'name',
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
          valueKey: 'is_excluding_mileage',
          title: 'Без учета пробега',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
        },
        {
          valueKey: 'equipment',
          title: 'Для спецоборудования',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
        },
      ],
    },
    list: {
      permissions: fuelOperationsPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'fuel_operations_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Операция',
            width: 200,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
          {
            key: 'is_excluding_mileage',
            title: 'Без учета пробега',
            format: 'boolean',
            width: 200,
          },
          {
            key: 'equipment',
            title: 'Для спецоборудования',
            format: 'boolean',
            width: 200,
          },
        ],
      },
    },
  };
};
