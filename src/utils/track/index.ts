import { TRACK_COLORS } from 'constants/track.js';
import { hexToRgba } from 'utils/functions.js';
import { swapCoords } from 'utils/geo';

/**
 * Получение цвета трека
 * @param props {object}
 * speed - скорость
 * maxSpeed - максимально разрешённая скорость
 * opacity - прозрачность
 */
export const getTrackColor = props => {
  const {
    speed,
    maxSpeed,
    opacity = 1,
  } = props;

  let result = TRACK_COLORS.green; // green by default

  if (speed >= 0 && speed <= maxSpeed) {
    result = TRACK_COLORS.green;
  }

  if (speed > maxSpeed) {
    result = TRACK_COLORS.red;
  }

  return opacity === 1 ? result : hexToRgba(result, opacity);
};

export const getDataAboutPointTrack = props => {
  const {
    coords,
    coords_msk,
    speed_avg: speed,
    max_speed: maxSpeed,
  } = props;

  return {
    ...props,
    coords: swapCoords(coords),
    coords_msk: swapCoords(coords_msk),
    color: getTrackColor({ speed, maxSpeed }),
  };
};
