export type IStateFuelRates = {

};

export type IFuelOperations = {
  is_active?: boolean | null;
};

export type IFuelRatesByCarModel = {
  car_id?: number | null;
  datetime?: string | null;
};

export type IEquipmentFuelRatesByCarModel = {
  car_id?: number | null;
  datetime?: string | null;
  for_equipment?: boolean | null;
};
