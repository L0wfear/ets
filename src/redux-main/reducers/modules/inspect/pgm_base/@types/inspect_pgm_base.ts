import { Company } from 'redux-main/reducers/modules/company/@types';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { ViewAddInspectEmployeeInitialState } from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/add_inspect_employee/addInspectEmployee';

export type InspectPgmBaseData = {
  address_base: string;
  balance_holder_base: string | null;
  head_balance_holder_base_fio: string;
  head_balance_holder_base_tel: string | null;
  operating_base: number | null;
  head_operating_base_fio: string;
  head_operating_base_tel: string | null;
  head_balance_holder_base: {
    tel: string | null;
    fio: string | null;
  }
  head_operating_base: {
    tel: string | null;
    fio: string | null;
  }
  lack_traffic_scheme_at_entrance: boolean | null;
  type_of_base_coverage: string;
  access_roads_in_poor_condition: boolean | null;
  lack_of_lighting: boolean | null;
  lack_of_personal_protection: boolean | null;
  lack_of_records_in_training_logs: boolean | null;
  lack_of_technical_passport: boolean | null;
  lack_of_documents_on_pgm: boolean | null;
  lack_of_documents_etc: string | null;
  lack_of_shower: boolean | null;
  lack_of_changing_rooms: boolean | null;
  lack_of_rest_rooms: boolean | null;
  lack_of_information_stands: boolean | null;
  lack_of_loading_unloading_mechanisms: boolean | null;
  lack_of_ramps_stairs: boolean | null;

  lack_of_height_restriction_sign: boolean | null;
  type_coverage_in_hangar: string;
  lack_of_lighting_in_hangars: boolean | null;
  lack_of_schema_slinging: boolean | null;
  lack_of_wooden_pallets: boolean | null;
  hangar_is_not_sealed: boolean | null;
  pgm_in_hangars: number | null;
  insufficient_availability_of_wooden_pallets: boolean | null;
  lack_of_shelter_for_solid_pgm: boolean | null;
  pgm_on_open_area: number | null;

  equipment_and_piping_in_poor_condition: boolean | null;
  containers_in_poor_condition: boolean | null;

  files: any[]; // может не надо
  photos_of_supporting_documents: any[],
  photos_defect: any[],
};

export type InspectPgmBase = {
  base_address: string;
  base_id: number | null;
  close_employee_fio: string;
  close_employee_id: number | null;
  company_id: number;
  company_name: string;
  data: InspectPgmBaseData;
  date_end: string | null;
  date_start: string | null;
  id: number;
  inspection_company_id: number;
  open_employee_fio: string;
  open_employee_id: number | null;
  status: 'conducting' | 'completed';
  status_text: 'Проводится';
  agents_from_gbu?: ViewAddInspectEmployeeInitialState['agents_from_gbu'];
  commission_members?: ViewAddInspectEmployeeInitialState['commission_members'];
  resolve_to?: ViewAddInspectEmployeeInitialState['resolve_to'];
  okrug_name: string | null;
  okrug_id: string | null;
  base_type_text: string | null;
  volume_capacity_sum: number | string | null;
  pgm_volume_sum: number | string | null;
  pgm_into_vol: number | string | null;
  row_number: number | null;
  capacity_cnt: number | null;
  head_balance_holder_base: {
    tel: string | null;
    fio: string | null;
  }
  head_operating_base: {
    tel: string | null;
    fio: string | null;
  },
  close_employee_position: string | null;
};

export type IStateInspectPgmBase = {
  companyList: Company[],
  okrugList: any[],
  carpoolList: Carpool[],
  pgmBaseList: any[],
  inspectPgmBaseList: InspectPgmBase[];
  lastConductingInspect: InspectPgmBase;
  lastCompletedInspect: InspectPgmBase;
};
