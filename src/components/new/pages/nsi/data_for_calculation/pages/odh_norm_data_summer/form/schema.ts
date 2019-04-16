import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { OdhNormDataSummer } from 'redux-main/reducers/modules/odh_norm_data_summer/@types/odhNormDataSummer';
import { PropsOdhNormDataSummer } from './@types/OdhNormDataSummerForm';

export const odhNormDataSummerFormSchema: SchemaType<OdhNormDataSummer, PropsOdhNormDataSummer> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    standard_id: {
      title: 'Норматив содержания ОДХ',
      type: 'valueOfArray',
      required: true,
    },
    unit: {
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: false,
    },
    categorized_1: {
      title: '1',
      type: 'number',
    },
    categorized_2: {
      title: '2',
      type: 'number',
    },
    categorized_3: {
      title: '3',
      type: 'number',
    },
    categorized_4: {
      title: '4',
      type: 'number',
    },
    categorized_5: {
      title: '5',
      type: 'number',
    },
    categorized_6a: {
      title: '6а',
      type: 'number',
    },
    categorized_6b: {
      title: '6б',
      type: 'number',
    },
    categorized_6c: {
      title: '6в',
      type: 'number',
    },
    categorized_7a: {
      title: '7а',
      type: 'number',
    },
    categorized_7b: {
      title: '7б',
      type: 'number',
    },
    uncategorized_highway: {
      title: 'Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")',
      type: 'number',
    },
    uncategorized_odhs_center: {
      title: 'ОДХ внутри Садового кольца',
      type: 'number',
    },
    uncategorized_odhs_other: {
      title: 'ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы',
      type: 'number',
    },
  },
};
