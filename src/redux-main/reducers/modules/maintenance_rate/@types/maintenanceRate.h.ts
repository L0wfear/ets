
export type maintenanceRate = {
  clean_category_id: number | null;
  clean_category_name: string | null;
  clean_subcategory_name: string | null;
  cleanpsubcategory_id: number | null;
  id: number | null;
  maintenance_work_id: number | null;
  maintenance_work_name: string | null;
  measure_unit_id: number | null;
  measure_unit_name: string | null;
  season_id: number | null;
  season_name: string | null;
  technical_operation_id: number | null;
  technical_operation_name: string | null;
  type: string | null;
  value: number | null;
};

export type ICreateMaintenanceRate = {
  clean_category_id: number | null;
  clean_subcategory_id: number | null;
  maintenance_work_id: number | null;
  season_id: number | null;
  technical_operation_id: number | null;
  type: string | null;
  value: number | null;
};
export type IMaintenanceRateUpd = ICreateMaintenanceRate & {
  id: number;
};

export type IStateMaintenanceRate = {
  maintenanceRateList: maintenanceRate[],
};
