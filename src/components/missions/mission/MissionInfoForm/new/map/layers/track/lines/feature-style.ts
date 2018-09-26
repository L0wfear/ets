import * as ol from 'openlayers';
import { TRACK_COLORS } from 'constants/track';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName, { greenSpeed } ) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5 / DEVICE_PIXEL_RATIO,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new ol.style.Fill({
        color:  greenSpeed ? TRACK_COLORS.green : TRACK_COLORS.red,
      }),
    }),
    stroke: new ol.style.Stroke({
      color: greenSpeed ? TRACK_COLORS.green : TRACK_COLORS.red,
      width: 5 / DEVICE_PIXEL_RATIO,
    }),
    zIndex: 9,
  });
}

export const getStyleForTrackLine = (greenSpeed) => {
  const cacheStyleName = `${greenSpeed}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { greenSpeed },
    );
  }

  return icon;
}