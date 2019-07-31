import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { PropsBridgesFormWithForm } from 'components/new/pages/nsi/geoobjects/pages/bridges/BridgesForm/@types/BridgesForm.h';

export const bridgesFormSchema: SchemaType<Bridges, PropsBridgesFormWithForm> = {
  properties: {},
};
