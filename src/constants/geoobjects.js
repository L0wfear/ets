export const GEOOBJECTS_TYPES = {
  'dt': 'dt',
  'odh': 'odh',
  'ssp': 'ssp',
  'msp': 'msp',
  'pgm_store': 'pgm',
  'pgm': 'pgm',
  'snow_storage': 'snowStorage',
  'danger_zone': 'dangerZone',
  'carpool': 'carpool',
  'fueling_water': 'fuelingWaterStation',
  'bridges': 'bridges',
  'pedestrian_tunnels': 'pedestrian_tunnels',
  'pedestrian_tunnel_exits': 'pedestrian_tunnel_exits',
  'fountains': 'fountains',
};

export const GEOOBJECTS_TYPES_LABELS = {
  'dt': 'ДТ',
  'odh': 'ОДХ',
  'ssp': 'ССП',
  'msp': 'МСП',
  'pgm_store': 'Пункты отпуска ПГМ',
  'pgm': 'Пункты отпуска ПГМ',
  'danger_zone': 'Особо опасные места',
  'snow_storage': 'Пункты временного складирования снега',
  'snowStorage': 'Пункты временного складирования снега',
  'dangerZone': 'Особо опасное место',
  'carpool': 'Автобазы',
  'fueling_water': 'Базы гидрантов',
  'fuelingWater': 'Базы гидрантов',
  'bridges': 'Мосты',
  'pedestrian_tunnels': 'Пешеходные тоннели',
  'pedestrian_tunnel_exits': 'Выходы из пешеходных тоннелей',
  'fountains': 'Фонтаны',
};

export const GEOOBJECTS_TYPES_LABELS_SINGLE = {
  'dt': 'ДТ',
  'odh': 'ОДХ',
  'pgm': 'Пункт отпуска ПГМ',
  'snowStorage': 'Пункт временного складирования снега',
  'ssp': 'Стационарный снегоплавильный пункт',
  'msp': 'Мобильный снегоплавильный пункт',
  'dangerZone': 'Особо опасное место',
  'carpool': 'Автобаза',
  'fuelingWaterStation': 'База гидрантов',
  'bridges': 'Мост',
  'pedestrian_tunnels': 'Пешеходный тоннель',
  'pedestrian_tunnel_exits': 'Выход из пешеходного тоннеля',
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
