export type PropsMapMissionInfoWrap = {
  gov_number: string;
  gps_code: string | null;
  geoobjects: object;
  inputLines: any;
  car_id?: number;
  speed_lim: number;
  mkad_speed_lim: number;
  track: Array<any>;
  parkings: Array<any>;
  cars_sensors: object;
  missionNumber: string | number;
};
