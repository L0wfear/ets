export const routeTypesBySlug = {
  dt: {
    key: 'simple_dt',
    title: 'ДТ',
    time: 4,
  },
  odh: {
    key: 'mixed',
    title: 'ОДХ',
    time: 5,
  },
  points: {
    key: 'points',
    title: 'ПН',
  },
};

export const routeTypesByKey = Object.entries(routeTypesBySlug)
  .reduce((newObj, [slug, { key, ...other }]) => ({
    ...newObj,
    [key]: {
      slug,
      ...other,
    },
  }), {});
