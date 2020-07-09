
export type MaintenanceRate = {
  clean_category_id: number;
  clean_category_name: string;
  clean_subcategory_id: number;
  clean_subcategory_name: string;
  cleanpsubcategory_id: number;
  company_id: number;
  company_name: string;
  id: number;
  maintenance_work_id: number;
  maintenance_work_name: string;
  measure_unit_id: number;
  measure_unit_name: string;
  okrug_name: string;
  season_id: number;
  season_name: string;
  technical_operation_id: number;
  technical_operation_name: string;
  type: string;
  value: number;
};

export type IStateMaintenanceRate = {
  maintenanceRateList: Array<MaintenanceRate>;
};
