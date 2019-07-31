import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { PropsCarpoolForm } from 'components/new/pages/nsi/geoobjects/pages/carpool/form/@types/CarpoolForm.h';

export const carpoolSchema: SchemaType<Carpool, PropsCarpoolForm> = {
  properties: {},
};
