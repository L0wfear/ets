import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import odhNormDataSummerPermissions from './permissions';
import { OdhNormDataSummer } from 'redux-main/reducers/modules/odh_norm_data_summer/@types/odhNormDataSummer';

export const registryKey = 'odhNormDataSummerRegistry';

const array: Array<OdhNormDataSummer> = [
  {
    id: 666,
    technical_operation_name: 'Мойка машиной',
    technical_operation_id: 10,
    standard_name: 'Площадь мойки 1 машиной',
    standard_id: 0,
    unit: 'кв. м.',
    categorized_1: '25000',
    categorized_2: '8000',
    categorized_3: '8000',
    categorized_4: '8000',
    categorized_5: '8000',
    categorized_6a: '25000',
    categorized_6b: '25000',
    categorized_6c: '25000',
    categorized_7a: '8000',
    categorized_7b: '5000',
    uncategorized_highway: '25000',
    uncategorized_odhs_center: '8000',
    uncategorized_odhs_other: '5000',
  },
];

export const getToConfig = (): TypeConfigData<OdhNormDataSummer> => {
  return {
    noInitialLoad: true,
    Service: {},
    registryKey,
    header: {
      title: 'Показатели норм по содержанию ОДХ (лето)',
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
          valueKey: 'standard_id',
          labelKey: 'standard_name',
          title: 'Норматив содержания ОДХ',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: odhNormDataSummerPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'odh_norm_data_summer_registry_id',
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
            key: 'standard_name',
            title: 'Норматив содержания ОДХ',
            width: 300,
          },
          {
            key: 'unit',
            title: 'Единица измерения',
            width: 200,
          },
          {
            key: 'categorized_1',
            title: '1',
            width: 100,
          },
          {
            key: 'categorized_2',
            title: '2',
            width: 100,
          },
          {
            key: 'categorized_3',
            title: '3',
            width: 100,
          },
          {
            key: 'categorized_4',
            title: '4',
            width: 100,
          },
          {
            key: 'categorized_5',
            title: '5',
            width: 100,
          },
          {
            key: 'categorized_6a',
            title: '6а',
            width: 100,
          },
          {
            key: 'categorized_6b',
            title: '6б',
            width: 100,
          },
          {
            key: 'categorized_6c',
            title: '6в',
            width: 100,
          },
          {
            key: 'categorized_7a',
            title: '7а',
            width: 100,
          },
          {
            key: 'categorized_7b',
            title: '7б',
            width: 100,
          },
          {
            key: 'uncategorized_highway',
            title: 'Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")',
            width: 400,
          },
          {
            key: 'uncategorized_odhs_center',
            title: 'ОДХ внутри Садового кольца',
            width: 400,
          },
          {
            key: 'uncategorized_odhs_other',
            title: 'ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы',
            width: 400,
          },
        ],
      },
    },
  };
};
