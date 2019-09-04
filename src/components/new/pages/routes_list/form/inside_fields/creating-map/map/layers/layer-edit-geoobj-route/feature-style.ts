import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

import { polyState, linesState } from 'constants/polygons';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: Record<string, Style> = {};

export const TYPES_STYLE = {
  geoobj: 'geoobj',
  input_lines: 'input_lines',
};

const stylesByPolyState = {
  [polyState.ENABLE]: (
    new Style({
      image: new Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.2)',
        }),
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 1)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.2)',
      }),
    })
  ),
  [polyState.SELECTED]: (
    new Style({
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
    })
  ),
  [polyState.SELECTED_IDLING]: (
    new Style({
      image: new Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 1)',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    })
  ),
};

const stylesByLinesState = {
  [linesState.SELECTED]: (
    new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4,
      }),
      zIndex: 10,
    })
  ),
  [linesState.SELECTED_IDLING]: (
    new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4,
        lineDash: [12],
      }),
      zIndex: 10,
    })
  ),
};

const makeCacheStyle = ({ type, state = polyState.SELECTED }) => {
  if (type === TYPES_STYLE.geoobj) {
    return stylesByPolyState[state];
  }
  if (type === TYPES_STYLE.input_lines) {
    return stylesByLinesState[state];
  }
};

export const getCasheStyleForGeoobject = (type, state) => {
  const cacheStyleName = `${type}/${state}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = CACHE_ICON[cacheStyleName] = makeCacheStyle(
      { type, state },
    );
  }

  return icon;
};
