/* Утилита openlayers для чтения геометрии */
import * as ol from 'openlayers';

export const GeoJSON = new ol.format.GeoJSON();

export const defaultZoom = new ol.control.Zoom({
  duration: 400,
  className: 'ol-zoom',
  delta: 1,
});
