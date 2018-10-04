export type PropsOverlay = {
  coordsMsk?: [number, number];
  map: ol.Map;
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
}

export type StateOverlay = {
  marker: ol.Overlay | null;
  container: HTMLDivElement;
}

export module OverlayUtils {
  export type hideOverlay = (
    marker: ol.Overlay,
    map: ol.Map,
  ) => void;

  export type setMakerPosition = (
    marker: ol.Overlay,
    coordsMsk: ol.Coordinate,
  ) => void;

  export type makeOverlay = (
    props: olx.OverlayOptions,
  ) => ol.Overlay;
}