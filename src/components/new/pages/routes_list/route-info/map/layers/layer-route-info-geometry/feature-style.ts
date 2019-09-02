import Style, { StyleFunction } from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import Point from 'ol/geom/Point';
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
      angle: -rotation + (Math.PI / 2),
    }),
  });
};

const makeCacheStyle = ({ type, state = 2 }) => {
  if (type === TYPES_STYLE.geoobj) {
    return new Style({
      image: new Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new Stroke({
          color: state === 2 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 255, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: state === 2 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      stroke: new Stroke({
        color: state === 2 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 255, 1)',
        width: 1,
      }),
      fill: new Fill({
        color: state === 2 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
      }),
      zIndex: 9,
    });
  }
  if (type === TYPES_STYLE.input_lines) {
    return new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4,
        lineDash: state === 3 ? [12] : undefined,
      }),
      zIndex: 10,
    });
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
