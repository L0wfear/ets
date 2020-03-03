import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { polyState } from 'constants/polygons';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: Record<string, Style> = {};

const maskStatusPoint = {
  fail: 1,
  any: undefined,
};

export const PointStyles = {
  [maskStatusPoint.fail]: {
    stroke: new Stroke({
      color: 'white',
    }),
    fill: new Fill({
      color: 'darkviolet',
    }),
  },
  [maskStatusPoint.any]: {
    stroke: new Stroke({
      color: 'white',
    }),
    fill: new Fill({
      color: 'green',
    }),
  },
};

export const polyStyles = {
  [polyState.ENABLE]: {
    fill: new Fill({
      color: 'rgba(0,0,0,0.2)',
    }),
    stroke: new Stroke({
      color: 'darkviolet',
      width: 1,
    }),
  },
  [polyState.SELECTED]: {
    fill: new Fill({
      color: 'rgba(255,255,255,0.5)',
    }),
    stroke: new Stroke({
      color: 'darkviolet',
      width: 1,
    }),
  },
  [polyState.SELECTED_IDLING]: {
    fill: new Fill({
      color: 'rgba(255,255,255,0.5)',
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 1,
    }),
  },
};

const defStroke = new Stroke({
  color: 'rgba(0, 0, 0, 0)',
  width: 1,
});

const defFill = new Fill({
  color: 'rgba(0, 0, 0, 0)',
});

const selectedStroke = new Stroke({
  color: '#e67e22',
  width: 1,
});

const selectedFill = new Fill({
  color: '#e67e22',
});

const makeCacheStyle = (cacheStyleName, { selected, state } ) => {
  return CACHE_ICON[cacheStyleName] = new Style({
    image: new Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: PointStyles[state] ? PointStyles[state].stroke : defStroke,
      fill: !selected ? PointStyles[state] && PointStyles[state].fill || defFill : selectedFill,
    }),
    stroke: !selected ? polyStyles[state] && polyStyles[state].stroke || defStroke : selectedStroke,
    fill: !selected ? polyStyles[state] && polyStyles[state].fill || defFill : selectedFill,
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
      { selected, state },
    );
  }

  return icon;
};
