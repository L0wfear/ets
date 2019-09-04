import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

import { TRACK_COLORS } from 'constants/track';

const DEVICE_PIXEL_RATIO = 1; // window.devicePixelRatio / 2;

const CACHE_ICON: Record<string, Style> = {};

const makeCacheStyle = (cacheStyleName, { greenSpeed } ) => {
  return CACHE_ICON[cacheStyleName] = new Style({
    image: new Circle({
      radius: 4 / DEVICE_PIXEL_RATIO,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new Fill({
        color:  greenSpeed ? TRACK_COLORS.green : TRACK_COLORS.red,
      }),
    }),
    stroke: new Stroke({
      color: greenSpeed ? TRACK_COLORS.green : TRACK_COLORS.red,
      width: 5 / DEVICE_PIXEL_RATIO,
    }),
    zIndex: 9,
  });
};

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
};
