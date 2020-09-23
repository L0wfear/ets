export type FuelOperation = (
  FuelOperationActive
  & {
    is_active?: boolean;
  }
);

export type FuelOperationActive = {
  equipment: boolean;
  id: number;
  is_excluding_mileage: boolean;
  measure_unit_id: number;
  measure_unit_name: string;
  name: string;
  engine_kind_ids?: Array<number>;
};
