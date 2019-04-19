export type ObjectProperty = {
  id: number;
  measure_unit_id: number;
  measure_unit_name: string;
  name: string;
  original_name: string;
  original_name_db: string;
  type_id: number;
  type_name: string;
  type_slug: 'odh' | 'dt' | string;
};
