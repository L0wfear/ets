import * as ol from 'openlayers';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName, { selected, color } ) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new ol.style.Fill({
        color:  selected ? 'yellow' : color || 'red',
      }),
    }),
    fill: new ol.style.Fill({
      color:  selected ? 'yellow' : color || 'red',
    }),
    zIndex: 9,
  });
}

export const getCasheStyleForGeoobject = (selected, color = '') => {
  const cacheStyleName = `${selected}/${color}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { selected, color },
    );
  }

  return icon;
}