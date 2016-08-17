export const pointStyles = {
  'geoobject': new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: 'red',
      }),
      stroke: new ol.style.Stroke({
        color: 'red',
        width: 2,
      }),
      radius: 5
    }),
  }),
  'geoobject-selected': new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({
        color: 'yellow',
      }),
      stroke: new ol.style.Stroke({
        color: 'yellow',
          width: 2,
      }),
      radius: 5
    }),
  })
};
