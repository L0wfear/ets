export const dt = 'dt';
export const odh = 'odh';
export const ssp = 'ssp';
export const msp = 'msp';
export const fueling_water = 'fueling_water';
export const carpool = 'carpool';
export const danger_zone = 'danger_zone';
export const pgm_store = 'pgm_store';
export const fountains = 'fountains';
export const bridges = 'bridges';
export const snow_storage = 'snow_storage';
export const pedestrian_tunnels = 'pedestrian_tunnels';
export const pedestrian_tunnel_exits = 'pedestrian_tunnel_exits';

export const geoozones = {
  [carpool]: 'carpool',
  [dt]: 'dt',
  [odh]: 'odh',
  [ssp]: 'ssp',
  [msp]: 'msp',
  [fueling_water]: 'fueling_water',
  [danger_zone]: 'danger_zone',
  [pgm_store]: 'pgm_store',
  [snow_storage]: 'snow_storage',
};

export const gormost = {
  [fountains]: 'fountains',
  [bridges]: 'bridges',
  [pedestrian_tunnels]: 'pedestrian_tunnels',
  [pedestrian_tunnel_exits]: 'pedestrian_tunnel_exits',
};

export const geometryByType = {
  geoozones,
  gormost,
};

export default {
  ...geoozones,
  ...gormost,
};
