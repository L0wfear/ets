export type InspectContainerActions = {
  name: string;
  date_start: string;
  date_end: string;
};

export type InspectContainer = {
  inspection_id: number;
  number: string;
  capacity: number;
  capacity_percent: number;
  pgm_volume: number;
  pgm_marka: string;
  last_checked_at: string;
  diagnostic_result: string;
  id: number; // бэк ещё не присылает
  data: {
    equipment_pipeline_in_poor_condition: boolean,
    control_measuring_instruments_in_poor_condition: boolean;
  },
  actions: InspectContainerActions[];
};
