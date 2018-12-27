import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';

const CACHE_ICON: any = {};

const makeCacheStyle = (cacheStyleName) => {
  return CACHE_ICON[cacheStyleName] = new Style({
    stroke: new Stroke({
      color: 'rgba(255, 0, 0, 0.3)',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.1)',
    }),
    image: new Circle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.5)',
      }),
    }),
  });
};

export const getStyleForPolygonBuffer = () => {
  const cacheStyleName = `polygon_buffer`;
  const { [cacheStyleName] : cache_style } = CACHE_ICON;
  let icon = cache_style;

  if (!cache_style) {
    icon = makeCacheStyle(
      cacheStyleName,
    );
  }

  return icon;
};
