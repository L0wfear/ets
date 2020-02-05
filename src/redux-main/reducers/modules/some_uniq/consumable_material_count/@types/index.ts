export type ConsumableMaterialCountMission = {
  consumable_material_id: number;
  consumable_material_name: string;
  consumable_material_short_name: string;
  consumable_material_measure_unit_id: number;
  consumable_material_measure_unit_name: string;
  consumable_material_norm_id: number;
  consumable_material_norm_value: number;
  is_order_operation_norm: boolean; // норма подтягивается из факсограммы, а не из справочника расходных материалов
  is_plan_value_locked: boolean;
  mission_progress_fact_value?: number;
  norm_value: number;
  municipal_facility_measure_unit_id: number;
  municipal_facility_measure_unit_name: string;
  plan_value: number;
  fact_value: number;
  consumption: number;
  is_fact_value_locked: boolean;
  is_consumption_locked: boolean;
  is_norm_value_locked: boolean;
};
