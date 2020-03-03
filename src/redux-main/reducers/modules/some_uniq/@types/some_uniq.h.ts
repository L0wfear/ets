import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { MunicipalFacility, MunicipalFacilityMeasureUnit } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { CleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/@types';
import { GeozoneMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/@types';
import { GeozoneMunicipalFacilityById } from 'redux-main/trash-actions/geometry/geometry.h';
import { WorkKind } from '../work_kind/@types/work_kind';
import { TechnicalOperationObjects } from '../technical_operation_objects/@types/technical_operation_objects';
import { TechnicalOperationTypes } from '../technical_operation_types/@types/technical_operation_types';
import { SensorType } from '../sensor_type/@types/sensor_type';
import { MeasureUnit } from '../measure_unit/@types';
import { RefillType } from '../../refill_type/@types/refillType';
import { CarsTravelTime } from '../cars_travel_time/@types';
import { EdcRequestInfo } from '../edc_request_info/@types';
import { TracksCaching } from '../tracks_caching/@types';
import { WorkMode } from 'redux-main/reducers/modules/some_uniq/work_mode/@types';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';

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
  technicalOperationRegistryForDutyMissionList: Array<TechnicalOperationRegistry>;
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
};
