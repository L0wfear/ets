import * as ol from 'openlayers';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

export const TYPES_STYLE = {
  geoobj: 'geoobj',
  input_lines: 'input_lines',
};

export const polyState = {
  ENABLE: 1,
  SELECTED: 2,
  SELECTED_IDLING: 3,
};

export const linesState = {
  SELECTED: 2,
  SELECTED_IDLING: 3,
};

const stylesByPolyState = {
  [polyState.ENABLE]: (
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 1)',
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 0, 0.2)',
        }),
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 1)',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 0, 0.2)',
      }),
    })
  ),
  [polyState.SELECTED]: (
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 0, 0, 1)',
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.1)',
        }),
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.1)',
      }),
    })
  ),
  [polyState.SELECTED_IDLING]: (
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6 / DEVICE_PIXEL_RATIO,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 255, 1)',
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 255, 1)',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    })
  ),
};

const stylesByLinesState = {
  [linesState.SELECTED]: (
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4,
      }),
      zIndex: 10,
    })
  ),
  [linesState.SELECTED_IDLING]: (
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 4,
        lineDash: [12],
      }),
      zIndex: 10,
    })
  )

}

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
}