import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { Efficiency } from 'redux-main/reducers/modules/efficiency/@types/efficiency';
import { PropsEfficiency } from './@types/EfficiencyForm';

export const efficiencyFormSchema: SchemaType<Efficiency, PropsEfficiency> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    source: {
      title: 'Источник',
      type: 'valueOfArray',
      required: true,
    },
    areal_feature_id: {
      title: 'Площадная характеристика',
      type: 'valueOfArray',
      required: false,
    },
    ratio: {
      title: 'Коэффициент',
      type: 'number',
    },
  },
};
