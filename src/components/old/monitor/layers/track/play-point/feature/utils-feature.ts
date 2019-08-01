import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Feature from 'ol/Feature';

const DEVICE_PIXEL_RATIO = 2; // window.devicePixelRatio;

const radius = 10 / (DEVICE_PIXEL_RATIO / 2);

export const getStroke = () => (
  new Stroke({
    color: 'rgb(255, 255, 255)',
  })
);

export const getFill = () => (
  new Fill({
    color: 'rgb(0, 0, 0)',
  })
);

export const getImageStyle = () => (
  new Circle({
    stroke: getStroke(),
    fill: getFill(),
    radius,
  })
);

export const setStyle = (feature) => (
  feature.setStyle(
    new Style({
      image: getImageStyle(),
    }),
  )
);

export const makeFeaute = () => {
  const feature = new Feature();
  setStyle(feature);

  feature.setId('point');

  return feature;
};
