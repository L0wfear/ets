export type PropsOverlay = {
  coordsMsk?: [number, number];
  map: ol.Map;
  hidePopup?: () => void;
  className?: string;
  title?: React.ReactNode;
}

export type StateOverlay = {
  coordsMsk: [number, number] | null;
  marker: ol.Overlay | null;
}

export module OverlayUtils {
  export type hideOverlay = (
    marker: ol.Overlay,
  ) => void;

  export type setMakerPosition = (
    marker: ol.Overlay,
    coordsMsk: ol.Coordinate,
  ) => void;

  export type makeOverlay = (
    props: olx.OverlayOptions,
  ) => ol.Overlay;
}