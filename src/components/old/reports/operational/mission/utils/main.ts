export const delRouteCheckUnitRender = {
  'м.': 1000,
  'кв. м.': 1,
  'раз': 1,
  'к': 1,
};

export const getDelForUnitRender = (name) => delRouteCheckUnitRender[name] ? delRouteCheckUnitRender[name] : 1;
