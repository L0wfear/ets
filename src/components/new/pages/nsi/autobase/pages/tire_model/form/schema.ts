import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsTireModel } from 'components/new/pages/nsi/autobase/pages/tire_model/form/@types/TireModelForm';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const tireModelFormSchema: SchemaType<TireModel, PropsTireModel> = {
  properties: {
    name: {
      title: 'Марка аккумулятора',
      type: 'string',
      required: true,
    },
    tire_manufacturer_id: {
      title: 'Производитель аккумулятора',
      type: 'valueOfArray',
      required: true,
    },
  },
};
