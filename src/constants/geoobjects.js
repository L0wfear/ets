export const GEOOBJECTS_TYPES = {
  'dt': 'dt',
  'odh': 'odh',
  'ssp': 'ssp',
  'msp': 'msp',
  'pgm_store': 'pgmStore',
  'snow_storage': 'snowStorage',
  'danger_zone': 'dangerZone',
  'carpool': 'carpool',
  'fueling_water': 'fuelingWaterStation',
  'bridges': 'bridges',
  'pedestrian_tunnels': 'pedestrian_tunnels',
  'pedestrian_tunnel_exits': 'pedestrian_tunnel_exits',
  'fountains': 'fountains',
};

export const GEOOBJECTS_TYPES_REVERSE = Object.entries(GEOOBJECTS_TYPES).reduce((newObj, [key, value]) => ({
  ...newObj,
  [value]: key,
}), {});

export const GEOOBJECTS_TYPES_LABELS = {
  'dt': 'ДТ',
  'odh': 'ОДХ',
  'ssp': 'ССП',
  'msp': 'МСП',
  'pgm_store': 'Пункты отпуска ПГМ',
  'pgmStore': 'Пункты отпуска ПГМ',
  'danger_zone': 'Особо опасные места',
  'dangerZone': 'Особо опасное место',
  'snow_storage': 'Пункты временного складирования снега',
  'snowStorage': 'Пункты временного складирования снега',
  'carpool': 'Автобазы',
  'fueling_water': 'Базы гидрантов',
  'fuelingWater': 'Базы гидрантов',
  'bridges': 'Мосты',
  'pedestrian_tunnels': 'Пешеходные тоннели',
  'pedestrianTunnels': 'Пешеходные тоннели',
  'pedestrian_tunnel_exits': 'Выходы из пешеходных тоннелей',
  'pedestrianTunnelExits': 'Выходы из пешеходных тоннелей',
  'fountains': 'Фонтаны',
};

export const GEOOBJECTS_TYPES_LABELS_SINGLE = {
  'dt': 'ДТ',
  'odh': 'ОДХ',
  'pgmStore': 'Пункты отпуска ПГМ',
  'snowStorage': 'Пункт временного складирования снега',
  'ssp': 'Стационарный снегоплавильный пункт',
  'msp': 'Мобильный снегоплавильный пункт',
  'dangerZone': 'Особо опасное место',
  'carpool': 'Автобаза',
  'fuelingWater': 'База гидрантов',
  'bridges': 'Мост',
  'pedestrianTunnels': 'Пешеходный тоннель',
  'pedestrianTunnelExits': 'Выход из пешеходного тоннеля',
  'fountains': 'Фонтан',
};

const BASE_GEOOBJECTS_LIST = [
  'dt',
  'odh',
  'ssp',
  'msp',
  'carpool',
  'fueling_water',
  'danger_zone',
  'pgm_store',
  'snow_storage',
];

export const GORMOST_GEOOBJECTS_LIST = [
  'bridges',
  'pedestrian_tunnels',
  'pedestrian_tunnel_exits',
  'fountains',
];

export const GEOOBJECTS_LIST = [
  ...BASE_GEOOBJECTS_LIST,
  ...GORMOST_GEOOBJECTS_LIST,
];
