import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { CleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/@types';
import { GeozoneMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/@types';
import { GeozoneMunicipalFacilityById } from 'redux-main/trash-actions/geometry/geometry.h';
import { ConsumptionRateMaterial } from 'redux-main/reducers/modules/some_uniq/material_consumption_rate/@types';

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
  specialModelList: SpecialModel[];
  modelsList: ModelElement[];
  technicalOperationRegistryList: TechnicalOperationRegistry[];
  technicalOperationRegistryForMissionList: TechnicalOperationRegistry[];
  technicalOperationRegistryForDutyMissionList: TechnicalOperationRegistry[];
  municipalFacilityList: MunicipalFacility[];
  municipalFacilityForMissionList: MunicipalFacility[];
  municipalFacilityForDutyMissionList: MunicipalFacility[];
  missionSource: {
    list: MissionSource[];
    order_mission_source_id: number | null;
  };
  maintenanceWorkList: MaintenanceWork[];
  cleanCategoriesList: CleanCategories[];
  missionCancelReasonsList: CancelReasons[];
  geozoneMunicipalFacility: {
    list: GeozoneMunicipalFacility[];
    byId: GeozoneMunicipalFacilityById | null;
  };
  consumptionRateMaterialList: ConsumptionRateMaterial[];
};
