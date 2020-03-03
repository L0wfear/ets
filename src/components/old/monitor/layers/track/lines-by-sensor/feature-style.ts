import { sensorTrackColor } from 'constants/sensors';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: Record<string, Style> = {};

const makeCacheStyle = (cacheStyleName, { countWork, SHOW_TRACK } ) => {
  if (!SHOW_TRACK) {
    return CACHE_ICON[cacheStyleName] = new Style({});
  }
  return CACHE_ICON[cacheStyleName] = new Style({
    stroke: new Stroke({
      color: `${sensorTrackColor[countWork]}`,
      width: 2 / DEVICE_PIXEL_RATIO,
    }),
    zIndex: 10,
  });
};

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
};
