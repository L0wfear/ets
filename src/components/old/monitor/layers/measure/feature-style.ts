import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

const CACHE_ICON: Record<string, Style> = {};

const makeCacheStyle = (cacheStyleName, { type }) => {
  if (type === 'template') {
    return CACHE_ICON[cacheStyleName] = new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.1)',
        }),
        fill: new Fill({
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
  return new Style({
    stroke: new Stroke({
      color,
      width: 2,
    }),
    image: new Circle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new Fill({
        color,
      }),
    }),
  });
};

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
};
