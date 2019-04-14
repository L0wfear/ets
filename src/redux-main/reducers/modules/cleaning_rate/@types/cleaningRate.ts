export type CleaningRate = {
  id: number;
  measure_unit_id: number;
  measure_unit_name: string;
  property: string;
  property_text: string;
  technical_operation_id: number;
  technical_operation_name: string;
  type: 'odh' | 'dt';
  value: number;
};
