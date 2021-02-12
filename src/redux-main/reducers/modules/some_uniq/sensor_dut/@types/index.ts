export type SensorDut = {
  type_slug: string | null;
  type_name: string | null;
  tracker_code: string | null;
  tar_start_date: string | Date;
  tar_end_date: string | Date;
  sensor_id: number | null;
  is_broken: boolean | null;
  sensor_type_id: number | null;
  sensor_number: string | null;
  sensor_protocol_id: number | null;
};
