import { isObject, isNullOrUndefined } from 'util';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

export type GetDefaultPedestrianTunnelExitsElement = (PedestrianTunnelExits: PedestrianTunnelExits | null) => PedestrianTunnelExits;

export const defaultPedestrianTunnelExits: PedestrianTunnelExits = {
  adm_area: '',
  created_at: null,
  district: '',
  geo_data_json: {},
  geo_data_msk_json: {},
  global_id: null,
  id: null,
  internal_id: '',
  name: '',
  number: null,
  shape: {},
  updated_at: null,
};

export const getDefaultPedestrianTunnelExitsFormElement: GetDefaultPedestrianTunnelExitsElement = (element) => {
  const newElement = { ...defaultPedestrianTunnelExits };
  if (isObject(element)) {
    Object.keys(defaultPedestrianTunnelExits).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultPedestrianTunnelExits[key];
    });
  }

  return newElement;
};
