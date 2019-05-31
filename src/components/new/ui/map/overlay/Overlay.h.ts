import Map from 'ol/Map';
import Overlay, { Options } from 'ol/Overlay';

export type PropsOverlay = {
  coordsMsk?: [number, number];
  map: Map;
  hidePopup?: () => void;
  title?: React.ReactNode;
  OverlayInside?: any;
  EtsOverlay?: any;
  EtsOverlayTitle?: any;
  OverlayClose?: any;
  EtsOverlayBody?: any;
  EtsTriangleWrap?: any;
  EtsTriangle?: any;
  [key: string]: any;
};

export type StateOverlay = {
  marker: Overlay | null;
  container: HTMLDivElement;
};

export namespace OverlayUtils {
  export type hideOverlay = (
    marker: Overlay,
    map: Map,
  ) => void;

  export type setMakerPosition = (
    marker: Overlay,
    coordsMsk: number[],
  ) => void;

  export type makeOverlay = (
    props: Options,
  ) => Overlay;
}
