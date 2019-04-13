import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsTire } from 'components/directories/autobase/tire/TireForm/@types/Tire.h';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const tireFormSchema: SchemaType<Tire, PropsTire> = {
  properties: {
    tire_model_id: {
      title: 'Модель шины',
      type: 'number',
      integer: true,
      required: true,
    },
    tire_size_id: {
      title: 'Размер',
      type: 'number',
      integer: true,
      required: true,
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
      maxLength: 4000,
      required: false,
    },
  },
};
