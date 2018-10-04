import { OverlayUtils } from 'components/map/overlay/Overlay.h';
import * as ol from 'openlayers';

/**
 * hide оверлея
 * Т.к. реакт, то оверлей просто уходит в закат
 * @param marker оверлей
 */
export const hideOverlay: OverlayUtils.hideOverlay = (marker, map) => (
  marker
  && map
  && map.removeOverlay(marker)
);

/**
 * изменение положения оверлея
 * @param marker оверлей
 * @param coords_msk координаты
 */
export const setMakerPosition: OverlayUtils.setMakerPosition = (marker, coords_msk) => (
  marker
  && Array.isArray(coords_msk)
  && coords_msk.length === 2
  && marker.setPosition(coords_msk)
);

/**
 * создание оверлея
 * @param props пропсы создания оверлея
 */
export const makeOverlay: OverlayUtils.makeOverlay = (props) => (
  new ol.Overlay({
    ...props,
  })
);
