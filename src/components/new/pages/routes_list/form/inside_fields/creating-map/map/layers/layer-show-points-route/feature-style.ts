import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: Record<string, Style> = {};

export const TYPES_STYLE = {
  geoobj: 'geoobj',
  input_lines: 'input_lines',
};

const makeCacheStyle = () => {
  return new Style({
    image: new Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.1)',
      }),
    }),
    stroke: new Stroke({
      color: 'rgba(255, 0, 0, 1)',
      width: 1,
    }),
    fill: new Fill({
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
};
