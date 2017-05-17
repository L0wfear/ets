import { IResponseRowObject } from './rest.h';

export interface IVehicleTypes extends IResponseRowObject<number> {
  asuods_id: number;
  full_name: string;
  is_trailer: boolean;
  plow_width_dt: number;
  plow_width_odh: number;
  season_id: number;
  season_name: string;
  short_name: string;
  speed_limit: number;
}
