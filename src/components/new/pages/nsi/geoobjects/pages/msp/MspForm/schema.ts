import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { PropsMspFormWithForm } from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/@types/MspForm.h';

export const mspFormSchema: SchemaType<Msp, PropsMspFormWithForm> = {
  properties: {},
};
