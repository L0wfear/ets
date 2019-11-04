import { MissionDataType } from 'redux-main/reducers/modules/missions/mission/@types';

export type FutureMissionsItemsType = {
  mission_id: number;
  title: string;
};

export type FutureMissionsItemsByTypeType = {
  faxogramm_id: number;
  id: number;
  mission_source_id: number;
  name: string;
  object_type_name: string;
  order_operation_id: string;
  waybill_id: number;
};

export type FutureMissionsAnsType = {
  items: Array<FutureMissionsItemsType>;
  items_centralized: Array<FutureMissionsItemsByTypeType>;
  items_decentralized: Array<FutureMissionsItemsByTypeType>;
  title: string;
  title_centralized: string;
  title_decentralized: string;
};

export type FutureMissionsInfoDataType = void;

export type FutureMissionsFormDataType = MissionDataType;
