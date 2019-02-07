import { isObject, isNullOrUndefined } from 'util';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

export type GetDefaultPedestrianTunnelsElement = (PedestrianTunnels: PedestrianTunnels | null) => PedestrianTunnels;

export const defaultPedestrianTunnels: PedestrianTunnels = {
  adm_area: '',
  created_at: null,
  district: '',
  geo_data_json: {},
  geo_data_msk_json: {},
  global_id: null,
  id: null,
  location: '',
  name: '',
  number: null,
  shape: {},
  updated_at: null,
};

export const getDefaultPedestrianTunnelsFormElement: GetDefaultPedestrianTunnelsElement = (element) => {
  const newElement = { ...defaultPedestrianTunnels };
  if (isObject(element)) {
    Object.keys(defaultPedestrianTunnels).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultPedestrianTunnels[key];
    });
  }

  return newElement;
};
