import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { PropsDangerZoneFormWithForm } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/@types/DangerZoneForm.h';

export const DangerZoneFormSchema: SchemaType<DangerZone, PropsDangerZoneFormWithForm> = {
  properties: {},
};
