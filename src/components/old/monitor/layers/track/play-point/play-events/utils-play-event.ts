import { PropsLayerPlayPoint } from 'components/monitor/layers/track/play-point/LayerPlayPoint.h';
import Point from 'ol/geom/Point';

type TypeActionOnPlay = (props: PropsLayerPlayPoint) => void;
type TypeActionOnStop = (props: PropsLayerPlayPoint) => void;

type TypeMakeExtent = (coords_msk: number[]) => [number, number, number, number];

const opt_options = {
  padding: [50, 550, 50, 50],
  maxZoom: 10,
};

export const setGeomentry = (feature, coords_msk) => (
  feature.setGeometry(
    new Point(coords_msk),
  )
);

export const makeExtent: TypeMakeExtent = (coords_msk) => (
  Array<number>(4).fill(1).map((d, i) => (
    coords_msk[i % 2]
  )) as [number, number, number, number]
);

export const centerOn = (coords_msk, props) => {
  const noCheckDisabledCenterOn = true;

  props.centerOn(
    {
      extent: makeExtent(coords_msk),
      opt_options,
    },
    noCheckDisabledCenterOn,
  );
};

export const setNullGeometryToFeature = (feature) => (
  feature.setGeometry(
    null,
  )
);

export const actionOnPlay: TypeActionOnPlay = ({ point: { coords_msk }, playTrackStatus, ...props }) => {
  const feature = props.getFeatureById('point');

  if (feature) {
    setGeomentry(feature, coords_msk);
    centerOn(coords_msk, props);
  }
};

export const actionOnStop: TypeActionOnStop = ({ getFeatureById }) => {
  const feature = getFeatureById('point');

  if (feature) {
    setNullGeometryToFeature(feature);
  }
};
