// тут задаются стили линий при отображении геообъектов и ТС на карте
export const polyState = {
  SELECTABLE: 1,
  ENABLED: 2,
  IDLE: 3,
};

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
};
