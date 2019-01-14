type OneRouteDataBySlug = {
  key: string;
  title: string;
  time?: number;
  needLoad: boolean;
};
type OneRouteDataByKey = {
  slug: string;
  title: string;
  time?: number;
  needLoad: boolean;
};

type TypeRouteTypesBySlug = {
  [key: string]: OneRouteDataBySlug;
};
type TypeRouteTypesByKey = {
  [slug: string]: OneRouteDataByKey;
};

export const routeTypesBySlug: TypeRouteTypesBySlug = {
  dt: {
    key: 'simple_dt',
    title: 'ДТ',
    time: 4,
    needLoad: true,
  },
  odh: {
    key: 'mixed',
    title: 'ОДХ',
    time: 5,
    needLoad: true,
  },
  points: {
    key: 'points',
    title: 'ПН',
    needLoad: false,
  },
};

export const routeTypesByKey: TypeRouteTypesByKey = Object.entries(routeTypesBySlug)
  .reduce((newObj, [slug, { key, ...other }]) => {
    newObj[key] = {
      slug,
      ...other,
    };

    return newObj;
  }, {});
