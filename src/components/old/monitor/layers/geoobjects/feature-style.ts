import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: any = {};

const makeCacheStyle = (cacheStyleName, { selected, color } ) => {
  return CACHE_ICON[cacheStyleName] = new Style({
    image: new Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new Fill({
        color:  selected ? 'yellow' : color || UiConstants.colorError,
      }),
    }),
    fill: new Fill({
      color:  selected ? 'yellow' : color || UiConstants.colorError,
    }),
    zIndex: 9,
  });
};

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
};
