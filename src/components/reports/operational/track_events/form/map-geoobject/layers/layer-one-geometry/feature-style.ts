import * as ol from 'openlayers';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: 'red',
      }),
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 0.2)',
    }),
    zIndex: 9,
  });
}

export const getCasheStyleForGeoobject = (selected, state) => {
  const cacheStyleName = `${selected}/${state}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
    );
  }

  return icon;
}