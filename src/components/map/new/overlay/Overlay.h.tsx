import * as React from 'react';

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

export module OverlayTypes {

}