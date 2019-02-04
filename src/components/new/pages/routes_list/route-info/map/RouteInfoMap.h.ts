import { Route } from 'redux-main/reducers/modules/routes/@types';

export type PropsMapGeoobjectWrap = {
  width?: string;
  height?: string;
  input_lines: Route['input_lines'];
  object_list: Route['object_list'];
  type: 'mixed' | 'simple_dt' | 'points';
  mapKey: string;
  rotationAngle?: number;
};

export type StateMapGeoobjectWrap = {
};
