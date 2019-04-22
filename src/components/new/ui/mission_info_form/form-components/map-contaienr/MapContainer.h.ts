import { ISpeedLimits } from 'components/new/ui/mission_info_form/MissionInfoForm.h';

export type PropsMapContainer = {
  gov_number: string;
  gps_code: string | null;
  geoobjects: object;
  inputLines: any;
  front_parkings: any[];
  track: any[];
  cars_sensors: object;
  missionNumber: number;
  has_mkad: boolean;
  object_type_name: string;

  speed_limits: ISpeedLimits;
};

export type StateMapContainer = {
  SHOW_GEOOBJECTS: boolean;
  SHOW_TRACK: boolean;
  geoobjects: object;
  track: any[];
  front_parkings: any[];
};
