import { TechnicalOperationObjectsList } from 'redux-main/trash-actions/technical-operation/promise/promise.d';
import {
  GeozoneMunicipalFacilityById,
  GeozonesDataByIndex,
} from 'redux-main/trash-actions/geometry/geometry.h';
import {
  StateRouteForm,
  ModifyBridgesForRoute,
} from 'components/new/pages/routes_list/form/RouteForm.h';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { Route } from 'redux-main/reducers/modules/routes/@types';

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
  geozone_municipal_facility_by_id: IStateSomeUniq['geozoneMunicipalFacility']['byId'];
  objectList: IStateSomeUniq['geozoneMunicipalFacility']['list'];
};

export type DispatchPropsCreatingMap = {
  actionGetAndSetInStoreGeozoneMunicipalFacility: HandleThunkActionCreator<
    typeof someUniqActions.actionGetAndSetInStoreGeozoneMunicipalFacility
  >;
  getTechnicalOperationsObjects: () => Promise<any>;
};

export type OwnPropsCreatingMap = {
  municipal_facility_id: number | null;
  technical_operation_id: number | null;
  structure_id: Route['structure_id'];
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

export type PropsCreatingMap = StatePropsCreatingMap &
  DispatchPropsCreatingMap &
  OwnPropsCreatingMap;
