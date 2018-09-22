import * as ol from 'openlayers';
const CACHE_ICON = {};

const makeCacheStyle = (cacheStyleName, { type }) => {
  if (type === 'template') {
    return CACHE_ICON[cacheStyleName] = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.1)',
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.8)',
        }),
      }),
    });
  }
  const color = [
    'rgb(',
    Array(3).fill(1).map(() => Math.round(Math.random() * 255)),
    ')']
    .join('');
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color,
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 5,
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new ol.style.Fill({
        color,
    }),
    }),
  });
}

export const getStyleForLineMeasure = ({ type }) => {
  const cacheStyleName = `${type}`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
      { type },
    );
  }

  return icon;
}