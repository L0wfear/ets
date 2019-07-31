import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { PropsOdhFormWithForm } from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/@types/OdhForm.h';

export const odhFormSchema: SchemaType<Odh, PropsOdhFormWithForm> = {
  properties: {},
};
