/* Утилита openlayers для чтения геометрии */
import formatGeoJSON from 'ol/format/GeoJSON';
import Zoom from 'ol/control/Zoom';

export const geoJSON = new formatGeoJSON();

export const defaultZoom = new Zoom({
  duration: 400,
  className: 'ol-zoom',
  delta: 1,
});
