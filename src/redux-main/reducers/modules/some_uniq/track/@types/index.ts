export type OneTrakData = {
  coords: Array<number>;
  coords_msk: Array<number>;
  direction: number | null;
  distance: number;
  ignition: number | null;
  nsat: number | null;
  sensors: {
    level?: Array<{
      val: number;
      sensor_id: number;
      i: number;
      raw: number;
      id: number;
    }>;
    equipment: Array<{
      any: any;
    }>;
  };
  speed_avg: number;
  speed_max: number | null;
  timestamp: number;
  yard_id: number;
};

export type TrackInfo = {
  consumption: number;
  sensor_refill: number;
  sensor_leak: number;
  distance: number;
  track: Array<OneTrakData>;
  sensor_start_value: number;
  sensor_finish_value: number;
};
