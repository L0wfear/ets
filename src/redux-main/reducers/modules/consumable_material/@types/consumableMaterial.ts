export type ConsumableMaterial = {
  id: number;
  measure_unit_id: number;
  measure_unit_name: string;
  name: string;
  short_name: string;
  norms: Array<{
    id: number;
    technical_operation_id: number;
    technical_operation_name: string;
    municipal_facility_id: number;
    municipal_facility_name: string;
    municipal_facility_measure_unit_id: number;
    municipal_facility_measure_unit_name: string;
    season_id: number;
    season_name: string;
    is_without_norm: boolean;
    value: number;
    date_start: string;
    date_end: string;
    is_used: boolean;
  }>;
};

export type ConsumableMaterialWrap = ConsumableMaterial & {
  technical_operation_ids: Array<ValuesOf<ConsumableMaterial['norms']>['technical_operation_id']>
  technical_operation_names: Array<ValuesOf<ConsumableMaterial['norms']>['technical_operation_name']>
  municipal_facility_ids: Array<ValuesOf<ConsumableMaterial['norms']>['municipal_facility_id']>
  municipal_facility_names: Array<ValuesOf<ConsumableMaterial['norms']>['municipal_facility_name']>
  to_element: Array<string>;
};
