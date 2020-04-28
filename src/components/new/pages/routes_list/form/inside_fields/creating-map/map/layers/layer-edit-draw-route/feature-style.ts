import Style, { StyleFunction } from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import Point from 'ol/geom/Point';

import { polyState, linesState } from 'constants/polygons';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const DEVICE_PIXEL_RATIO = 2 / 2; // window.devicePixelRatio / 2;

const CACHE_ICON: Record<string, Style> = {};

export const TYPES_STYLE = {
  geoobj: 'geoobj',
  input_lines: 'input_lines',
};

export const createArrowStyle = (start, end) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const rotation = Math.atan2(dy, dx);

  return new Style({
    geometry: new Point(end),
    image: new RegularShape({
      fill: new Fill({ color: UiConstants.colorError }),
      points: 3,
      radius: 4,
      stroke: new Stroke({
        color: UiConstants.colorError,
      }),
      rotation: -rotation + (Math.PI / 2),
    }),
  });
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
        color: 'rgba(0, 0, 255, 1)',
        width: 4,
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

export const inputLineStyleFunc: StyleFunction  = (feature) => {
  const state = feature.get('state');
  const style = [
    getCasheStyleForGeoobject(TYPES_STYLE.input_lines, state),
  ];

  (feature.getGeometry() as any).forEachSegment((start, end) => {
    style.push(createArrowStyle(start, end));
  });

  return style;
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
