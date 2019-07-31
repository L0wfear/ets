import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { PropsCleaningRate } from './@types/CleaningRateForm';

export const cleaningRateFormSchema: SchemaType<CleaningRate, PropsCleaningRate> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    measure_unit_id: {
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: true,
    },
    property: {
      title: 'Площадная характеристика',
      type: 'string',
      required: true,
    },
    value: {
      title: 'Коэффициент',
      type: 'number',
      float: 3,
      required: true,
    },
  },
};
