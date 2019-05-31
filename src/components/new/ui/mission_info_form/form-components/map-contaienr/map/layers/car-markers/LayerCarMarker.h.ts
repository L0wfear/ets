export type PropsLayerCarMarker = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource;
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource;
  getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById;
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer;

  token: string;
  points_ws: string;
  gps_code: string | null;
};

export type OneWsDataCardata = {
  company_id: number | void;
  contract_type_ids: string[] | void;
  contractor_ids: number[] | void;
  customer_ids: number[] | void;
  gov_number: string;
  model_id: number | void;
  owner_id: number | void;
  provider_ids: number[] | void;
  type_id: number | void;
};

export type OneWsData = {
  car: OneWsDataCardata;
  connection_status_date: number | void;
  coords: number[];
  coords_msk: number[];
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
