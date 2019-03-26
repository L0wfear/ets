import { Company } from 'redux-main/reducers/modules/company/@types';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { ViewAddInspectEmployeeInitialState } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/add_inspect_employee/addInspectEmployee';

type InspectAutobaseData = {
  is_under_construction: boolean;
  is_less_than_two_entrances: boolean;
  absence_of_a_shield_with_a_scheme_of_movement: boolean;
  is_road_signs: boolean;
  lack_of_fire_fighting_equipment: boolean;
  no_fencing: boolean;
  fencing_in_poor_condition: boolean;
  is_not_protected: boolean;
  protection_is_carried: boolean;
  lack_of_video_surveillance: boolean;
  is_hard_surface: boolean;
  surface_in_poor_condition: boolean;
  surface_area_of_destruction: number | null;
  presence_of_pits_potholes: boolean;
  lack_of_lighting: boolean;
  cnt_defective_light: number | null;
  lack_control_room: boolean;
  lack_repair_areas: boolean;
  cnt_repair_posts: number | null;
  repair_posts_in_poor_condition: boolean;
  lack_of_storage_facilities: boolean;
  lack_of_a_canopy_for_pgm: boolean;
  lack_of_washing: boolean;
  lack_of_recreation: boolean;
  lack_of_domestic: boolean;
  domestic_in_poor_condition: boolean;
  lack_of_water_supply: boolean;
  lack_of_sanitation: boolean;
  lack_of_toilets: boolean;
  lack_shower_cabins: boolean;
  files: any[];
  photos_of_supporting_documents: any[],
  photos_defect: any[],
};

export type InspectAutobase = {
  base_address: string;
  base_id: number | null;
  close_employee_fio: string;
  close_employee_id: number | null;
  company_id: number;
  company_name: string;
  data: InspectAutobaseData;
  date_end: string | null;
  date_start: string | null;
  id: number;
  inspection_company_id: number;
  open_employee_fio: string;
  open_employee_id: number | null;
  status: 'conducting' | 'completed';
  status_text: 'Проводится';
  agent_from_gbu?: ViewAddInspectEmployeeInitialState['agent_from_gbu'];
  commission_members?: ViewAddInspectEmployeeInitialState['commission_members'];
  resolve_to?: ViewAddInspectEmployeeInitialState['resolve_to'];
};

export type IStateInspectAutobase = {
  companyList: Company[],
  carpoolList: Carpool[],
  inspectAutobaseList: InspectAutobase[];
  lastConductingInspect: InspectAutobase;
  lastCompletedInspect: InspectAutobase;
};
