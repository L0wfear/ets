export type CarDriversData = {
  car_id: number;
  primary_drivers: Array<number>;
  secondary_drivers: Array<number>;
};

export type CarRegistrationData = {
  car_id: number;
  certificate_number: string;
  given_at: string;
  given_by: string;
  id: number;
  note: string;
  disabled?: boolean;
  files?: Array<any>;
};

export type CarGibddPasspost = {
  address: string;
  axle_number: number | string;
  body_color: string;
  body_number: string;
  car_id: number;
  category_id: number;
  chassis: string;
  company_address: string;
  conformity_certificate: string;
  customs_declaration: string;
  customs_restrictions: string;
  dimensions: string;
  empty_weight: number;
  engine_model: string;
  engine_number: string;
  engine_power: number;
  engine_type_id: number;
  engine_volumne: number;
  environmental_class: string;
  exporter_country_id: number;
  func_type_id: number;
  gearbox: number | string;
  given_at: string;
  given_by: string;
  id: number;
  manufactured_at: number;
  manufacturer: string | number;
  max_speed: number;
  max_weight: number;
  number: string;
  origin_country_id: number;
  propulsion_type_id: number;
  seria_number: string;
  tech_inspection_certificate: string;
  type: 'GIBDD';
  vin: string;

  disabled?: boolean;
  files?: Array<any>;
};

export type CarGtnPasspost = {
  address: string;
  axle_number: number | string;
  body_color: string;
  body_number: string;
  car_id: number;
  category_id: number;
  chassis: string;
  company_address: string;
  conformity_certificate: string;
  customs_declaration: string;
  customs_restrictions: string;
  dimensions: string;
  empty_weight: number;
  engine_model: string;
  engine_number: string;
  engine_power: number;
  engine_type_id: number;
  engine_volumne: number;
  environmental_class: string;
  exporter_country_id: number;
  func_type_id: number;
  gearbox: number | string;
  given_at: string;
  given_by: string;
  id: number;
  manufactured_at: number;
  manufacturer: string | number;
  max_speed: number;
  max_weight: number;
  number: string;
  origin_country_id: number;
  propulsion_type_id: number;
  seria_number: string;
  tech_inspection_certificate: string;
  type: 'GTN';
  vin: string;

  disabled?: boolean;
  files?: Array<any>;
};

export type CarPassporntData = (
  CarGibddPasspost
  | CarGtnPasspost
);
