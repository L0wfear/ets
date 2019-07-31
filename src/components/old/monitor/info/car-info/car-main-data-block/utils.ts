export const getMaxSpeedToLegend = (carInfo) => (
  carInfo.missionsData[carInfo.trackCaching.isCorssingMKAD ? 'mkad_speed_lim' : 'speed_lim']
);
