export interface ITireToCar {
  car_id: number;
  installed_at: string;
  uninstalled_at: string;
}

export interface ITireAvailableCar {
  car_id: number;
  gov_number: string;
}

export interface IBattreyToCar {
  car_id: number;
  installed_at: string;
  uninstalled_at: string;
}

export interface IBatteryAvailableCar {
  car_id: number;
  gov_number: string;
}
