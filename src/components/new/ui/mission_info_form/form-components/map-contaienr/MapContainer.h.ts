import { ISpeedLimits } from 'components/new/ui/mission_info_form/MissionInfoForm.h';

export type PropsMapContainer = {
  gov_number: string;
  gps_code: string | null;
  geoobjects: object;
  inputLines: any;
  front_parkings: Array<any>;
  track: Array<any>;
  cars_sensors: object;
  missionNumber?: number;
  has_mkad: boolean;
  object_type_name: string;
  car_id: number;
  speed_limits: ISpeedLimits;
};

export type StateMapContainer = {
  SHOW_GEOOBJECTS: boolean;
  SHOW_TRACK: boolean;
  geoobjects: object;
  track: Array<any>;
  front_parkings: Array<any>;
};
