import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';
import { PropsNorm } from './@types';

export const normFormSchema: SchemaType<Norm, PropsNorm> = {
  properties: [
    {
      key: 'sensor_type_ids',
      type: 'multiValueOfArray',
      title: 'Типы навесного оборудования',
    },
  ],
};
