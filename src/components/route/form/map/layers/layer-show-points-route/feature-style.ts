import * as ol from 'openlayers';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

export const TYPES_STYLE = {
  geoobj: 'geoobj',
  input_lines: 'input_lines',
};

const makeCacheStyle = () => {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
      fill: new ol.style.Fill({
        color:'rgba(255, 0, 0, 0.1)',
      }),
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(255, 0, 0, 1)',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 0.1)',
    }),
    zIndex: 9,
  });
};

export const getCasheStyleForGeoobject = (type) => {
  const cacheStyleName = `${type}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = CACHE_ICON[cacheStyleName] = makeCacheStyle();
  }


  return icon;
}