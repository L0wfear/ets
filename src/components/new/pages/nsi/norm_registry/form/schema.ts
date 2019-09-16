import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { PropsNorm } from './@types';

export const normFormSchema: SchemaType<Norm, PropsNorm> = {
  properties: {
    sensor_type_ids: {
      type: 'multiValueOfArray',
      title: 'Типы навесного оборудования',
    },
  },
};
