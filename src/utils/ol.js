/* Утилита openlayers для чтения геометрии */
export const GeoJSON = new ol.format.GeoJSON();

export const defaultZoom = new ol.control.Zoom({
  duration: 400,
  className: 'ol-zoom',
  delta: 1,
});

export function getPointStyle(fillColor, radius = 7, strokeColor = 'white', strokeWidth = 2) {
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius,
      snapToPixel: false,
      fill: new ol.style.Fill({
        color: fillColor,
      }),
      stroke: new ol.style.Stroke({
        color: strokeColor,
        width: strokeWidth,
      }),
    }),
  });
}

export function getPolyStyle(color, width = 1) {
  return new ol.style.Style({
    fill: new ol.style.Fill({
      color,
    }),
    stroke: new ol.style.Stroke({
      color,
      width,
    }),
  });
}
