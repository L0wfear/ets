import * as ol from 'openlayers';
const DEVICE_PIXEL_RATIO = 2; // window.devicePixelRatio;

const radius = 10 / (DEVICE_PIXEL_RATIO / 2);

export const getStroke = () => (
  new ol.style.Stroke({
    color: 'rgb(255, 255, 255)',
  })
);

export const getFill = () => (
  new ol.style.Fill({
    color: 'rgb(0, 0, 0)',
  })
)

export const getImageStyle = () => (
  new ol.style.Circle({
    stroke: getStroke(),
    fill: getFill(),
    radius,
  })
);

export const setStyle = (feature) => (
  feature.setStyle(
    new ol.style.Style({
      image: getImageStyle(),
    })
  )
)

export const makeFeaute = () => {
  const feature = new ol.Feature();
  setStyle(feature);
  

  feature.setId('point');

  return feature;
}