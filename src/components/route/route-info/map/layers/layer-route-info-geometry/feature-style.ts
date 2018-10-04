import * as ol from 'openlayers';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

export const TYPES_STYLE = {
  geoobj: 'geoobj',
  input_lines: 'input_lines',
};

export const createArrowStyle = (start, end) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const rotation = Math.atan2(dy, dx);

  return new ol.style.Style({
    geometry: new ol.geom.Point(end),
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({ color: 'red' }),
      points: 3,
      radius: 4,
      stroke: new ol.style.Stroke({
        color: 'red',
      }),
      rotation: -rotation + (Math.PI / 2),
    }),
  });
}

const makeCacheStyle = ({ type, state = 2 }) => {
  if (type === TYPES_STYLE.geoobj) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new ol.style.Stroke({
          color: state === 2 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 255, 1)',
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: state === 2 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      stroke: new ol.style.Stroke({
        color: state === 2 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 255, 1)',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: state === 2 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)',
      }),
      zIndex: 9,
    });
  }
  if (type === TYPES_STYLE.input_lines) {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4,
        lineDash: state === 3 ? [12] : undefined,
      }),
      zIndex: 10,
    });
  }
};

export const inputLineStyleFunc: ol.StyleFunction  = (feature) => {
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
}