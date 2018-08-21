import { sensorTrackColor } from 'constants/sensors';

const DEVICE_PIXEL_RATIO = window.devicePixelRatio / 2;

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName, { countWork, SHOW_TRACK } ) => {
  if (!SHOW_TRACK) {
    return CACHE_ICON[cacheStyleName] = new ol.style.Style({});
  }
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: `${sensorTrackColor[countWork]}`,
      width: 2 / DEVICE_PIXEL_RATIO,
    }),
    zIndex: 10,
  });
}

export const getStyleForTrackLineBySensor = (countWork, SHOW_TRACK) => {
  const cacheStyleName = !SHOW_TRACK ? 'SHOW_TRACK' : `${countWork}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { countWork, SHOW_TRACK },
    );
  }

  return icon;
}