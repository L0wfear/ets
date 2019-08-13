import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: any = {};

const makeCacheStyle = (cacheStyleName) => {
  return CACHE_ICON[cacheStyleName] = new Style({
    image: new Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new Stroke({
        color: '#a94442',
        width: 1,
      }),
      fill: new Fill({
        color: '#a94442',
      }),
    }),
    stroke: new Stroke({
      color: '#a94442',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.2)',
    }),
    zIndex: 9,
  });
};

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
};
