import * as ol from 'openlayers';

export const CACHE_ROUTE_DRAW_STYLES = {
  red: (
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 0, 0, 1)',
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.1)',
        }),
      }),
    })
  ),
  blue: ([
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#0099ff',
        width: 4,
      }),
      image: (
        new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 1)',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)',
          }),
        })
      ),
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#0099ff',
        width: 2,
      }),
    })
  ]),
};

export const getStyle = () => {
  return CACHE_ROUTE_DRAW_STYLES.blue;
}