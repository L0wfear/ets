import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';

export const getMaxSpeedToLegend = (carInfo: IStateMonitorPage['carInfo']) => (
  carInfo.missionsAndWaybillsData[carInfo.trackCaching.isCorssingMKAD ? 'mkad_speed_lim' : 'speed_lim']
);
