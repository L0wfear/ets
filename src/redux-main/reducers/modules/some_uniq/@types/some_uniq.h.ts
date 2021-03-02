import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import {
  MunicipalFacility,
  MunicipalFacilityMeasureUnit,
} from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { CleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/@types';
import { GeozoneMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/@types';
import { GeozoneMunicipalFacilityById } from 'redux-main/trash-actions/geometry/geometry.h';
import { WorkKind } from 'redux-main/reducers/modules/some_uniq/work_kind/@types/work_kind';
import { TechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/@types/technical_operation_objects';
import { TechnicalOperationTypes } from 'redux-main/reducers/modules/some_uniq/technical_operation_types/@types/technical_operation_types';
import { SensorType } from 'redux-main/reducers/modules/some_uniq/sensor_type/@types/sensor_type';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';
import { RefillType } from 'redux-main/reducers/modules/refill_type/@types/refillType';
import { CarsTravelTime } from 'redux-main/reducers/modules/some_uniq/cars_travel_time/@types';
import { EdcRequestInfo } from 'redux-main/reducers/modules/some_uniq/edc_request_info/@types';
import { TracksCaching } from 'redux-main/reducers/modules/some_uniq/tracks_caching/@types';
import { SensorDut } from 'redux-main/reducers/modules/some_uniq/sensor_dut/@types';
import { WorkMode } from 'redux-main/reducers/modules/some_uniq/work_mode/@types';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';
import { CleaningRatePropertie } from 'redux-main/reducers/modules/some_uniq/properties/@types';
import { ReasonList } from 'redux-main/reducers/modules/some_uniq/reason_list/@types';
import { EngineKind } from 'redux-main/reducers/modules/some_uniq/engine_kind/@types';
import { SelectedMissionsList } from 'redux-main/reducers/modules/some_uniq/waybill/@types';
import { OneRefillFuelCompanyData } from 'redux-main/reducers/modules/some_uniq/refill_fuel_company/@types';
import { FuelTypes } from 'redux-main/reducers/modules/some_uniq/fuel_types/@types';
import { MileageType } from 'redux-main/reducers/modules/some_uniq/car_mileage_options/@types';
import { User } from 'redux-main/reducers/modules/some_uniq/users_access/@types';
import { Okrug } from 'redux-main/reducers/modules/some_uniq/okrugs/@types';

export type ModelElement = {
  body_capacity: number | null;
  full_name: string | null;
  id: number;
  load_capacity: number | null;
  max_speed: number;
  title: string | null;
};
export type CancelReasons = {
  id: number;
  name: string;
  status: string;
};

export type IStateSomeUniq = {
  specialModelList: Array<SpecialModel>;
  modelsList: Array<ModelElement>;
  technicalOperationRegistryList: Array<TechnicalOperationRegistry>;
  technicalOperationRegistryForMissionList: Array<TechnicalOperationRegistry>;
  technicalOperationRegistryForDutyMissionList: Array<
    TechnicalOperationRegistry
  >;
  municipalFacilityList: Array<MunicipalFacility>;
  municipalFacilityMeasureUnitList: Array<MunicipalFacilityMeasureUnit>;
  municipalFacilityForMissionList: Array<MunicipalFacility>;
  municipalFacilityForDutyMissionList: Array<MunicipalFacility>;
  missionSource: {
    list: Array<MissionSource>;
    order_mission_source_id: number | null;
  };
  maintenanceWorkList: Array<MaintenanceWork>;
  cleanCategoriesList: Array<CleanCategories>;
  cleaningRatePropertieList: Array<CleaningRatePropertie>;
  missionCancelReasonsList: Array<CancelReasons>;
  geozoneMunicipalFacility: {
    list: Array<GeozoneMunicipalFacility>;
    byId: GeozoneMunicipalFacilityById | null;
  };
  workKindList: Array<WorkKind>;
  technicalOperationObjectsList: Array<TechnicalOperationObjects>;
  technicalOperationTypesList: Array<TechnicalOperationTypes>;
  sensorTypeList: Array<SensorType>;
  measureUnitList: Array<MeasureUnit>;

  refillTypeList: Array<RefillType>;

  carsTravelTimeList: Array<CarsTravelTime>;
  edcRequestInfoList: Array<EdcRequestInfo>;
  tracksCaching: TracksCaching;
  sensorDut: SensorDut;

  workModeList: Array<WorkMode>;
  normList: Array<Norm>;

  inspectionConfig: {
    [key: string]: {};
  } | null;

  consumableMaterialCountMissionList: Array<ConsumableMaterialCountMission>;
  moscowTimeServer: {
    timestamp: number;
    date: string;
  };
  reasonList: Array<ReasonList>;
  engineKindList: Array<EngineKind>;

  selectedMissionsList: Array<SelectedMissionsList>;
  refillFuelCompany: OneRefillFuelCompanyData;
  fuelTypesList: Array<FuelTypes>;
  mileageTypesList: Array<MileageType>;
  usersAccessList: Array<User>;
  okrugsList: Array<Okrug>;
};
