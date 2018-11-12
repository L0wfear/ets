export type PropsMapMissionInfoWrap = {
  gov_number: string;
  gps_code: string | null;
  geoobjects: object;

  speed_lim: number;
  mkad_speed_lim: number;
  track: any[];
  parkings: any[];
  cars_sensors: object;
  missionNumber: string | number;
};
