import Map from 'ol/Map';

export type TypeLastPoint = {
  timestamp: number;
  coords_msk: [number, number],
};

export type PropsCarAttributeInformation = {
  company_name: string,
  gov_number: string,
  garage_number: string,
  gps_code: number,
  status: number,
  type_name: string,
  model_name: string,
  lastPoint: TypeLastPoint,
  errorInLoadTrack: boolean;
  map: Map;
  carActualGpsNumberIndex: any;
};
