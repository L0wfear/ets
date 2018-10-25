import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export const CACHE_ROUTE_DRAW_STYLES = {
  red: (
    new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 1)',
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.1)',
        }),
      }),
    })
  ),
  blue: ([
    new Style({
      stroke: new Stroke({
        color: '#0099ff',
        width: 4,
      }),
      image: (
        new Circle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 255, 1)',
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        })
      ),
    }),
    new Style({
      stroke: new Stroke({
        color: '#0099ff',
        width: 2,
      }),
    })
  ]),
};

export const getStyle = () => {
  return CACHE_ROUTE_DRAW_STYLES.blue;
}