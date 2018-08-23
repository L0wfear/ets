export const hideOverlay = (marker) => (
  marker
  && setMakerPosition(
      marker,
      [
        -Number.MAX_SAFE_INTEGER,
        -Number.MAX_SAFE_INTEGER,
      ]
    )
);

export const setMakerPosition = (marker, coords_msk) => (
  marker
  && Array.isArray(coords_msk)
  && coords_msk.length === 2
  && marker.setPosition(coords_msk)
);

export const makeOverlay = (props: olx.OverlayOptions) => (
  new ol.Overlay({
    ...props,
  })
);
