import { isObject, isNullOrUndefined } from 'util';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';

export type GetDefaultDangerZoneElement = (DangerZone: DangerZone | null) => DangerZone;

export const defaultDangerZone: DangerZone = {
  address_comm: '',
  company_name: '',
  id: null,
  name: '',
  okrug_name: null,
  roadway_area: null,
  shape: {},
  sidelines_area: null,
  sidewalk_area: null,
};

export const getDefaultDangerZoneFormElement: GetDefaultDangerZoneElement = (element) => {
  const newElement = { ...defaultDangerZone };
  if (isObject(element)) {
    Object.keys(defaultDangerZone).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultDangerZone[key];
    });
  }

  return newElement;
};
