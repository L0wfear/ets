import { TechnicalOperationObjectsList } from 'redux-main/trash-actions/technical-operation/promise/promise.d';
import { GeozoneMunicipalFacilityById, GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { StateRouteForm, ModifyBridgesForRoute } from '../../RouteForm.h';

export type StateCreatingMap = {
  technical_operations_object_list: TechnicalOperationObjectsList;
  geozone_municipal_facility_by_id: GeozoneMunicipalFacilityById;
  object_list: PropsCreatingMap['object_list'];
  OBJECT_LIST_OPTIONS: any[];
  objectListIdArr: number[];
  type: PropsCreatingMap['type'];
  manual: boolean;
  hand: boolean;
};

export type StatePropsCreatingMap = {
};

export type DispatchPropsCreatingMap = {
  loadGeozoneMunicipalFacility: (municipal_facility_id: number, technical_operation_id: number, object_type_id: number) => Promise<any>;
  getTechnicalOperationsObjects: () => Promise<any>;
};

export type OwnPropsCreatingMap = {
  municipal_facility_id: number | null;
  technical_operation_id: number | null;
  bridges?: ModifyBridgesForRoute;
  input_lines: any[];
  object_list: any[];
  error: string;
  draw_object_list: any[];
  type: any | null;
  isPermitted: boolean;

  page: string | void;
  path: string | void;

  checkRoute: () => any;
  onChange: (changeObj: { [key: string]: any }) => any;
};

export type PropsCreatingMap = (
  StatePropsCreatingMap
  & DispatchPropsCreatingMap
  & OwnPropsCreatingMap
);
