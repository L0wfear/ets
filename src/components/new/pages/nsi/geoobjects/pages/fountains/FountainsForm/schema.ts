import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { PropsFountainsFormWithForm } from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/@types/FountainsForm.h';

export const fountainsFormSchema: SchemaType<Fountains, PropsFountainsFormWithForm> = {
  properties: {},
};
