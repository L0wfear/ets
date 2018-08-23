export type PropsOverlay = {
  coords_msk?: [number, number];
  map: ol.Map;
  hidePopup?: () => void;
  className?: string;
  title?: React.ReactNode;
}

export type StateOverlay = {
  coords_msk: [number, number] | null;
  marker: ol.Overlay | null;
}

export module OverlayUtils {
  export type hideOverlay = (
    marker: ol.Overlay,
  ) => void;

  export type setMakerPosition = (
    marker: ol.Overlay,
    coords_msk: ol.Coordinate,
  ) => void;

  export type makeOverlay = (
    props: olx.OverlayOptions,
  ) => ol.Overlay;
}