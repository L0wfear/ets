export type FuelTypes = {
  engine_kind_alias: 'fuel' | 'electrical';
  engine_kind_id: number;
  id: FuelTypesId;
  is_fuel_card: boolean;
  name: string;
};

export type FuelTypesId = 'AI95' | 'AI92' | 'A80'| 'DT' | 'GAS'| 'ELECTRICITY';
