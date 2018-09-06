export const polyState = {
  SELECTABLE: 1,
  ENABLED: 2,
  IDLE: 3,
};

const CACHE_ODH_COLOR = {};

export const polyStyles = {
  [polyState.SELECTABLE]: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: '#333',
      width: 1,
    }),
  }),
  [polyState.ENABLED]: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.5)',
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1,
    }),
  }),
  [polyState.IDLE]: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.5)',
    }),
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 1,
    }),
  }),
  'geoobject': new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'red',
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1,
    }),
  }),
  'geoobject-selected': new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'yellow',
    }),
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1,
    }),
  }),
  odh: (color) => {
    console.log(color)
    if (!CACHE_ODH_COLOR[color]) {
      CACHE_ODH_COLOR[color] = new ol.style.Style({
        fill: new ol.style.Fill({
          color,
        }),
        stroke: new ol.style.Stroke({
          color,
          width: 1,
        }),
      });
    }

    return CACHE_ODH_COLOR[color];
  },
};
