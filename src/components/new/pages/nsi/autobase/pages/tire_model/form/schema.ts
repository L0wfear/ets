import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTireModel } from 'components/new/pages/nsi/autobase/pages/tire_model/form/@types/TireModelForm';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const tireModelFormSchema: SchemaType<TireModel, PropsTireModel> = {
  properties: {
    name: {
      title: 'Модель шины',
      type: 'string',
      required: true,
    },
    tire_manufacturer_id: {
      title: 'Производитель шины',
      type: 'valueOfArray',
      required: true,
    },
  },
};
