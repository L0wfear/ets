import { IResponseRowObject } from './rest.h';

interface IStringHashTable {
  [field: string]: string;
}

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

  // "defaults": {
  //   "FUEL_TYPE": "DT"
  // },
  // "summer_end": [
  //   10,
  //   31
  // ],
  // "summer_start": [
  //   4,
  //   15
  // ],
  // "enums": {
  //   "FUEL_TYPE": {
  //     "A80": "А-80",
  //     "AI95": "АИ-95",
  //     "DT": "ДТ",
  //     "AI92": "АИ-92"
  //   }
  // }

export interface IAppConfig {
  defaults: IStringHashTable;
  enums: IStringHashTable;
  summer_start: [
    /*month*/number,
    /*day*/number
  ];
  summer_end: [
    /*month*/number,
    /*day*/number
  ];
}
