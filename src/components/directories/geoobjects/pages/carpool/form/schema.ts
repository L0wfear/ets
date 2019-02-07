import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { PropsCarpool } from 'components/directories/geoobjects/pages/carpool/form/@types/CarpoolForm.h';

export const carpoolSchema: SchemaType<Carpool, PropsCarpool> = {
  properties: [
  ],
};
