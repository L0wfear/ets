import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { IStateMonitorPage } from '../../redux-main/models/monitor-page';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

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
  gps_code?: string;
  forToday: boolean;
  STATUS_SHOW_GOV_NUMBER: boolean;
  STATUS_TC_FOLLOW_ON_CAR: boolean;
  geoobjectsFilter: IStateMonitorPage['geoobjectsFilter'];
  carActualGpsNumberIndex: any;
  carActualList: Array<Car>;
  carActualGpsCount: number;
  carActualNotInMap: Array<Car>;
  lastPoint: any;
  odh_mkad: Array<any>;
  statusShow: Record<'in_move' | 'stop' | 'parking' | 'not_in_touch', boolean>;
  filters: IStateMonitorPage['filters']['data'];
  carsForExclude: IStateMonitorPage['filters']['carsForExclude'];
  carInfoSetStatus: any;
  carInfoPushPointIntoTrack: any;
  monitorPageResetCarStatus: any;
  centerOn: any;
  monitorPageChangeCarsByStatus: any;
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
  connection_status_date?: number;
  coords: [number, number];
  coords_msk: [number, number];
  direction?: number;
  distance: number;
  id: string;
  nsat?: number;
  speed?: number;
  speed_max?: number;
  status?: number;
  status_date?: number;
  timestamp?: number;
  front_status: string;
  visibleWithoutFilters?: boolean;
  visible?: boolean;
};

export type WsData = {
  [gps_code: string]: OneWsData;
};

export type OneCarPointDataWsType = OneWsData;

export type CarPointsDataWsType = {
  [gps_code: string]: OneCarPointDataWsType;
};

export type StateLayerCarMarker = {
  carPointsDataWs: CarPointsDataWsType;
  ws: any;
};

export namespace LayerCarMarkerUtils {}
