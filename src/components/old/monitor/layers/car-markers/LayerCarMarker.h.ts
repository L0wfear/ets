import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type PropsLayerCarMarker = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;
  token: string;
  points_ws: string;
  zoom: number;
  gps_code: string | void;
  forToday: boolean;
  STATUS_SHOW_GOV_NUMBER: boolean;
  STATUS_TC_FOLLOW_ON_CAR: boolean;

  carActualGpsNumberIndex: any;
  carActualGpsCount: number;
  lastPoint: any;
  odh_mkad: Array<any>;
  statusShow: any;
  filters: any;

  carInfoSetStatus: any;
  carInfoPushPointIntoTrack: any;
  monitorPageResetCarStatus: any;
  centerOn: any;
  monitoPageChangeCarsByStatus: any;
  monitorPageMergeFiltredCarGpsCode: any;
} & WithSearchProps;

export type OneWsDataCardata = {
  company_id: number | void;
  contract_type_ids: Array<string> | void;
  contractor_ids: Array<number> | void;
  customer_ids: Array<number> | void;
  gov_number: string;
  gps_code: string;
  model_id: number | void;
  owner_id: number | void;
  provider_ids: Array<number> | void;
  type_id: number | void;
};

export type OneWsData = {
  car: OneWsDataCardata;
  connection_status_date: number | void;
  coords: Array<number>;
  coords_msk: Array<number>;
  direction: number | void;
  distance: number;
  id: string;
  nsat: number | void;
  speed: number | void;
  speed_max: number | void;
  status: number | void;
  status_date: number | void;
  timestamp: number | void;
};

export type WsData = {
  [gps_code: string]: OneWsData;
};

export type OneCarPointDataWsType =
  | OneWsData
  | {
      front_status: string;
    };

export type CarPointsDataWsType = {
  [gps_code: string]: OneCarPointDataWsType;
};

export type StateLayerCarMarker = {
  carPointsDataWs: CarPointsDataWsType;
  ws: any;
};

export namespace LayerCarMarkerUtils {}
