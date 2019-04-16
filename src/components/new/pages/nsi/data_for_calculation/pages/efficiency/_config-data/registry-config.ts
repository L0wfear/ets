import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import efficiencyPermissions from './permissions';
import { Efficiency } from 'redux-main/reducers/modules/efficiency/@types/efficiency';

export const registryKey = 'efficiencyRegistry';

const array: Array<Efficiency> = [
  {
    id: 666,
    technical_operation_name: 'Ручная уборка тратуаров',
    technical_operation_id: 100,
    source: '0',
    areal_feature_name: 'Общая площадь (кв.м.)',
    areal_feature_id: 0,
    ratio: 0.8,
  },
  {
    id: 667,
    technical_operation_name: 'Автоматическая уборка тратуаров',
    technical_operation_id: 120,
    source: '1',
    areal_feature_name: 'Количество урн на остановках в кв.м.',
    areal_feature_id: 10,
    ratio: 0.4,
  },
];

export const getToConfig = (): TypeConfigData<Efficiency> => {
  return {
    noInitialLoad: true,
    Service: {},
    registryKey,
    header: {
      title: 'Реестр показателей для расчета эффективности',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.read,
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
          valueKey: 'source',
          title: 'Источник',
          type: 'multiselect',
          options: [
            { value: 1, label: 'Справочник показателей норм на содержание ОДХ' },
            { value: 0, label: 'Реестр ОДХ' },
          ],
        },
        {
          valueKey: 'areal_feature_id',
          labelKey: 'areal_feature_name',
          title: 'Площадная характеристика',
          type: 'multiselect',
        },
        {
          valueKey: 'ratio',
          title: 'Коэффициент',
          type: 'advanced-number',
          step: 0.1,
        },
      ],
    },
    list: {
      permissions: efficiencyPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'efficiency_registry_id',
        array,
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
            width: 300,
          },
          {
            key: 'source',
            title: 'Источник',
            width: 200,
            format: 'efficiencySource',
          },
          {
            key: 'areal_feature_name',
            title: 'Площадная характеристика',
            width: 250,
          },
          {
            key: 'ratio',
            title: 'Коэффициент',
            width: 100,
          },
        ],
      },
    },
  };
};
