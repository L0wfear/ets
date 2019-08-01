import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsCarFuncTypes } from 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/@types/CarFuncTypes.h';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const carFuncTypesFormSchema: SchemaType<CarFuncTypes, PropsCarFuncTypes> = {
  properties: {
    avg_work_hours: {
      title: 'Среднее количество часов работы',
      type: 'number',
      integer: true,
      required: true,
      min: 1,
      max: 24,
    },
  },
};
