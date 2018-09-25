import * as ol from 'openlayers';

const DEVICE_PIXEL_RATIO = 2 / 2; //window.devicePixelRatio / 2;

const CACHE_ICON = {};

export const polyState = {
  SELECTABLE: 1,
  ENABLED: 2,
  IDLE: 3,
};

const maskStatusPoint = {
  fail: 1,
  any: undefined,
};

export const PointStyles = {
  [maskStatusPoint.fail]: {
    stroke: new ol.style.Stroke({
      color: 'white',
    }),
    fill: new ol.style.Fill({
      color: 'red',
    }),
  },
  [maskStatusPoint.any]: {
    stroke: new ol.style.Stroke({
      color: 'white',
    }),
    fill: new ol.style.Fill({
      color: 'green',
    }),
  },
};

export const polyStyles = {
  [polyState.SELECTABLE]: {
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: '#333',
      width: 1,
    }),
  },
  [polyState.ENABLED]: {
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.5)',
    }),
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 1,
    }),
  },
  [polyState.IDLE]: {
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,0.5)',
    }),
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 1,
    }),
  },
};

const defStroke = new ol.style.Stroke({
  color: 'rgba(0, 0, 0, 0)',
  width: 1,
});

const defFill = new ol.style.Fill({
  color: 'rgba(0, 0, 0, 0)',
});

const selectedStroke = new ol.style.Stroke({
  color: '#e67e22',
  width: 1,
});

const selectedFill = new ol.style.Fill({
  color: '#e67e22',
});

const makeCacheStyle = (cacheStyleName, { selected, state } ) => {
  return CACHE_ICON[cacheStyleName] = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6 / DEVICE_PIXEL_RATIO,
      stroke: PointStyles[state] ? PointStyles[state].stroke : defStroke,
      fill: !selected ? PointStyles[state] && PointStyles[state].fill || defFill : selectedFill,
    }),
    stroke: !selected ? polyStyles[state] && polyStyles[state].stroke || defStroke: selectedStroke,
    fill: !selected ? polyStyles[state] && polyStyles[state].fill || defFill : selectedFill,
    zIndex: 9,
  });
}

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
}