import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';
import cleaningAreaRatePermissions from './permissions';
import { CleaningAreaRateService } from 'api/Services';

export const registryKey = 'CleaningAreaRateRegistry';

export const getToConfig = (): TypeConfigData<CleaningAreaRate> => {
  return {
    Service: {
      getRegistryData: {
        entity: CleaningAreaRateService._path,
      },
    },
    registryKey,
    header: {
      title: 'Коэффициенты площади уборки',
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
          valueKey: 'municipal_facility_id',
          labelKey: 'municipal_facility_name',
          title: 'Элемент',
          type: 'multiselect',
        },
        {
          valueKey: 'clean_category_id',
          labelKey: 'clean_category_name',
          title: 'Категория ОДХ',
          type: 'multiselect',
        },
        {
          valueKey: 'clean_subcategory_id',
          labelKey: 'clean_subcategory_name',
          title: 'Подкатегория ОДХ',
          type: 'multiselect',
        },
        {
          valueKey: 'value',
          title: 'Коэффициент площади уборки',
          type: 'advanced-number',
          step: 0.01,
        },
      ],
    },
    list: {
      permissions: cleaningAreaRatePermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'cleaning_area_rates_registry_id',
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
            width: 225,
          },
          {
            key: 'municipal_facility_name',
            title: 'Элемент',
            width: 200,
          },
          {
            key: 'clean_category_name',
            title: 'Категория ОДХ',
            width: 200,
          },
          {
            key: 'clean_subcategory_name',
            title: 'Подкатегория ОДХ',
            width: 200,
          },
          {
            key: 'value',
            title: 'Коэффициент площади уборки',
            width: 250,
          },
        ],
      },
    },
  };
};
