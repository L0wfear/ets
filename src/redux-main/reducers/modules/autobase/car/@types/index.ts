export type CarDriversData = {
  car_id: number;
  primary_drivers: number[];
  secondary_drivers: number[];
};

export type CarRegistrationData = {
  car_id: number;
  certificate_number: string;
  given_at: string;
  given_by: string;
  id: number;
  note: string;
  disabled?: boolean;
};
