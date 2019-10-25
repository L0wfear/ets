import { isObject, isNullOrUndefined } from 'util';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const defaultCarsConditionCar: CarsConditionCars = {
  inspection_id: null,
  fact_status: '',
  fact_status_text: '',
  gov_number: '',
  id: null,
  car_id: null,
  marka: '',
  model: '',
  type: '',
  was_resaved: false,
  state_exploitation: '',
  vin: '',
  vin_incorrect: false,
  factory_number_incorrect: false,
  vin_by_hand: '',
  factory_number_by_hand: '',
  factory_number: '',
  manufactured_at: null,
  environmental_class: '',
  engine_type: '',
  max_weight: null,
  origin_country: '',
  kind: '',
  kind_purchase: '',
  gby_district: '',
  gby_operation_district: '',
  last_repair_company: '',
  last_tm_repair_company: '',
  registration_date: null,
  exploitation_date_start: null,
  last_repair: null,
  odometr_fact: null,
  motohours_fact: null,
  status_at_check: '',
  osago: '',
  osago_finished_at: null,
  diagnostic_card: '',
  diagnostic_card_finished_at: null,
  status: '',
  last_tech_inspection_date: null,
  last_inspection_equipment: null,
  updated_at: null,
  season: '',
  mileage: null,
  motohours: null,
  okrug_name: null,
  okrug_id: null,
  last_repair_date: null,
  repair_from_date: null,
  on_base: false,
  data: {
    defects_body: false,
    defects_chassis: false,
    defects_attachments: false,
    incomplete_equipment: false,
    liquids_leak: false,

    does_not_start: false,
    broken_chassis: false,
    broken_attachments: false,
    broken_lighting: false,
    broken_lighting_alarm: false,
    broken_audible_alarm: false,
    broken_windscreen_wipers: false,
    broken_windscreen_washers: false,

    no_registration: false,
    owner_not_match: false,
    no_vin: false,
    registration_not_match_vin: false,
    no_valid_diagnostic_card: false,
    osago_not_required: false,
    no_valid_osago: false,
    act_readiness_not_issued: false,

    untimely_maintenance: false,
    not_ready_to_work: false,
    comments: '',

    waybill_number: null,
    mission_numbers: null,
    not_passed_verification_glonass: false,
    repair_application: '',
    classifier: '',
    tech_inspection_passed: '',
    glonass_stationary: '',
    glonass_registered: '',
    logo: '',
    tech_condition: '',
    repair_reason: '',
    not_maintenance_and_repair: false,
    own_tech_maintenance: false,
  },

  files: [],
};

export const getDefaultCarsConditionCarElement = (element: Partial<CarsConditionCars>) => {
  const newElement = { ...defaultCarsConditionCar };
  if (isObject(element)) {
    Object.keys(defaultCarsConditionCar).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultCarsConditionCar[key];
    });
  }

  return newElement;
};
