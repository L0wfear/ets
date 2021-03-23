export type OneRefillFuelCompanyData = {
  refills: Array<{
    number: string;
    fuel_type_text: string;
    refill_at: string;
    fuel_given: number;
  }>;
  tx_ids: Array<string>;
};
