export const BASE_GEOOBJECTS_LIST = {
  dt: {
    serverName: 'dt',
    label: 'ДТ',
    labelSingl: 'ДТ',
  },
  odh: {
    serverName: 'odh',
    label: 'ОДХ',
    labelSingl: 'ОДХ',
  },
  odh_mkad: {
    serverName: 'odh_mkad',
    label: 'ОДХ МКАД',
    labelSingl: 'ОДХ МКАД',
  },
  ssp: {
    serverName: 'ssp',
    label: 'ССП',
    labelSingl: 'Стационарный снегоплавильный пункт',
  },
  msp: {
    serverName: 'msp',
    label: 'МСП',
    labelSingl: 'Мобильный снегоплавильный пункт',
  },
  carpool: {
    serverName: 'carpool',
    label: 'Автобазы',
    labelSingl: 'Автобаза',
  },
  pgm_store: {
    serverName: 'pgm_store',
    label: 'Пункты отпуска ПГМ',
    labelSingl: 'Пункт отпуска ПГМ',
  },
  snow_storage: {
    serverName: 'snow_storage',
    label: 'Пункты временного складирования снега',
    labelSingl: 'Пункт временного складирования снега',
  },
  danger_zone: {
    serverName: 'danger_zone',
    label: 'Особо опасные места',
    labelSingl: 'Особо опасное место',
  },
  fueling_water: {
    serverName: 'fueling_water',
    label: 'Базы гидрантов',
    labelSingl: 'База гидрантов',
  },
};

export const GORMOST_GEOOBJECTS_LIST = {
  bridges: {
    serverName: 'bridges',
    label: 'Мосты',
    labelSingl: 'Мост',
  },
  pedestrian_tunnels: {
    serverName: 'pedestrian_tunnels',
    label: 'Пешеходные тоннели',
    labelSingl: 'Пешеходный тоннель',
  },
  pedestrian_tunnel_exits: {
    serverName: 'pedestrian_tunnel_exits',
    label: 'Выходы из пешеходных тоннелей',
    labelSingl: 'Выход из пешеходного тоннеля',
  },
  fountains: {
    serverName: 'fountains',
    label: 'Фонтаны',
    labelSingl: 'Фонтан',
  },
};

/**
 * влияет на стейт monitor-page
 */
export const GEOOBJECTS_OBJ = {
  ...BASE_GEOOBJECTS_LIST,
  ...GORMOST_GEOOBJECTS_LIST,
};

export const GEOOBJECTS_LIST_WITH_CARS = {
  ...BASE_GEOOBJECTS_LIST,
  cars: {
    serverName: 'cars',
    label: 'ТС',
    labelSingl: 'ТС',
  },
};

export const GEOOBJECTS_OBJ_BY_SERVER_NAME = Object.entries(GEOOBJECTS_OBJ).reduce((newObj, [id, { serverName, ...other }]) => ({
  ...newObj,
  [serverName]: {
    id,
    ...other,
  },
}), {});
