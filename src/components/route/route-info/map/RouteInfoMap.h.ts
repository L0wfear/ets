import { AnsLoadGeozonesFunc } from 'redux-main/trash-actions/geometry/geometry.h';
import {
  DrawData,
  ObjectDtOdhData,
  ObjectPointData,
} from 'redux-main/trash-actions/route/@types/promise.h';

export type PropsMapGeoobjectWrap = {
  width?: string;
  height?: string;
  input_lines: DrawData[];
  object_list: (ObjectDtOdhData & ObjectPointData)[];
  type: 'mixed' | 'simple_dt' | 'points';
  loadGeozones: (serverName: string) => Promise<AnsLoadGeozonesFunc>,
  mapKey: string;
  rotationAngle?: number;
};

export type StateMapGeoobjectWrap = {
  object_list: (ObjectDtOdhData & ObjectPointData)[];
  objectList: (ObjectDtOdhData & ObjectPointData)[];
};