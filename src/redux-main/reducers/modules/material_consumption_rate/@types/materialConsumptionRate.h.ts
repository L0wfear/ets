
export type materialConsumptionRate = {
  clean_category_id: number | null;
  clean_category_name: string | null;
  clean_subcategory_id: number | null;
  clean_subcategory_name: string | null;
  consumable_material_id: number | null;
  consumable_material_name: string | null;
  id: number | null;
  season_id: number | null;
  season_name: string | null;
  technical_operation_id: number | null;
  technical_operation_name: string | null;
  value: number | null;
};

export type ICreateMaterialConsumptionRate = {
  technical_operation_id: number | null;
  consumable_material_id: number | null;
  season_id: number | null;
  clean_category_id: number | null;
  clean_subcategory_id: number | null;
  value: number | null;
};
export type IMaterialConsumptionRateUpd = ICreateMaterialConsumptionRate & {
  id: number;
};

export type IStateMaterialConsumptionRate = {
  materialConsumptionRateList: materialConsumptionRate[],
};
