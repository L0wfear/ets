import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import cleaningRatePermissions from './permissions';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';

export const registryKey = 'cleaningRateRegistry';

export const getToConfig = (type?: CleaningRate['type']): TypeConfigData<CleaningRate> => {
  return {
    noInitialLoad: !type,
    Service: {
      getRegistryData: {
        entity: 'cleaning_rate',
        payload: {
          type,
        },
      },
      removeOneData: {
        entity: 'cleaning_rate',
        uniqKeyLikeQueryString: false,
      },
      getBlobData: {
        entity: 'cleaning_rate',
        payload: {
          type,
          format: 'xls',
        },
      },
    },
    registryKey,
    header: {
      title: 'Показатели для расчета эффективности работы бригад',
      format: 'select_odh/dt',
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
          valueKey: 'technical_operation_id',
          labelKey: 'technical_operation_name',
          title: 'Технологическая операция',
          type: 'multiselect',
        },
        {
          valueKey: 'property_text',
          title: 'Площадная характеристика',
          type: 'multiselect',
        },
        {
          valueKey: 'value',
          title: 'Коэффициент',
          type: 'multiselect',
        },
        {
          valueKey: 'measure_unit_id',
          labelKey: 'measure_unit_name',
          title: 'Единица измерения',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: cleaningRatePermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'cleaning_rate_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'technical_operation_name',
            title: 'Технологическая операция',
            width: 200,
          },
          {
            key: 'property_text',
            title: 'Площадная характеристика',
            width: 200,
          },
          {
            key: 'value',
            title: 'Коэффициент',
            width: 200,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
        ],
      },
    },
  };
};
