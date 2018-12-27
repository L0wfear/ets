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
  mapKey: string;
  rotationAngle?: number;
};

export type StateMapGeoobjectWrap = {
};
