import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export type InspectActScan = {
  company_id: number;
  content_type: string;
  created_at: string;
  id: number;
  kind: string;
  name: string;
  notes: string;
  object_id: number;
  status: string;
  subdir: string;
  updated_at: string;
  url: string;
};

export type InspectOneActScan = {
  id: number;
  name: string;
  inspection_id: number;
  files: any[],
  notes: string;
  inspection?: InspectAutobase | InspectPgmBase | InspectCarsCondition;
};
