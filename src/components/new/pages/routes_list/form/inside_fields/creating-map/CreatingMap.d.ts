import { HandleThunkActionCreator } from 'react-redux';
import {
  GeozoneMunicipalFacilityById,
} from 'redux-main/trash-actions/geometry/geometry.h';
import {
  ModifyBridgesForRoute,
} from 'components/new/pages/routes_list/form/RouteForm.h';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { TechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/@types/technical_operation_objects';
import { actionGetAndSetInStoreGeozoneMunicipalFacility } from 'redux-main/reducers/modules/some_uniq/geozone_municipal_facility/actions';

export type StateCreatingMap = {
  technical_operations_object_list: Array<TechnicalOperationObjects>;
  geozone_municipal_facility_by_id: GeozoneMunicipalFacilityById;
  object_list: PropsCreatingMap['object_list'];
  OBJECT_LIST_OPTIONS: Array<any>;
  objectListIdArr: Array<number>;
  type: PropsCreatingMap['type'];
  manual: boolean;
  hand: boolean;
};

export type StatePropsCreatingMap = {
  geozone_municipal_facility_by_id: IStateSomeUniq['geozoneMunicipalFacility']['byId'];
  objectList: IStateSomeUniq['geozoneMunicipalFacility']['list'];
};

export type DispatchPropsCreatingMap = {
  actionGetAndSetInStoreGeozoneMunicipalFacility: HandleThunkActionCreator<
    typeof actionGetAndSetInStoreGeozoneMunicipalFacility
  >;
  dispatch: EtsDispatch;
};

export type OwnPropsCreatingMap = {
  municipal_facility_id: number | null;
  technical_operation_id: number | null;
  structure_id: Route['structure_id'];
  bridges?: ModifyBridgesForRoute;
  input_lines: Array<any>;
  object_list: Array<any>;
  error: string;
  draw_object_list: Array<any>;
  type: any | null;
  isPermitted: boolean;
  work_type_code: Route['work_type_code'];

  page: string;
  path: string;

  checkRoute: () => any;
  onChange: (changeObj: { [key: string]: any; }) => any;
};

export type PropsCreatingMap = StatePropsCreatingMap &
  DispatchPropsCreatingMap &
  OwnPropsCreatingMap;
