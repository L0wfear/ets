import { AnsLoadGeozonesFunc } from 'redux-main/trash-actions/geometry/geometry.h';
import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';

export type PropsMapGeoobjectWrap = {
  width?: string;
  height?: string;
  input_lines: Route['input_lines'];
  object_list: Route['object_list'];
  type: 'mixed' | 'simple_dt' | 'points';
  loadGeozones: (serverName: string) => Promise<AnsLoadGeozonesFunc>,
  mapKey: string;
  rotationAngle?: number;
};

export type StateMapGeoobjectWrap = {
  object_list: Route['object_list'];
  objectList: Route['object_list'];
};
