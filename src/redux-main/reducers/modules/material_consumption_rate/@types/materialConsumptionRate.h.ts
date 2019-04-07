
export type MaterialConsumptionRate = {
  clean_category_id: number;
  clean_category_name: string;
  clean_subcategory_id: number;
  clean_subcategory_name: string;
  consumable_material_id: number;
  consumable_material_name: string;
  id: number;
  season_id: number;
  season_name: string;
  technical_operation_id: number;
  technical_operation_name: string;
  value: number;
};

export type IStateMaterialConsumptionRate = {
  materialConsumptionRateList: MaterialConsumptionRate[],
};
