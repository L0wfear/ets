import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';

export type PropsRouteFormWrap = InputRouteFormProps & {
  showForm: boolean;
};

export type StateRouteFormProps = {
  userData: InitialStateSession['userData'];
  userStructureId: InitialStateSession['userData']['structure_id'];
  userStructureName: InitialStateSession['userData']['structure_name'];
  geozoneMunicipalFacility: IStateSomeUniq['geozoneMunicipalFacility'];
};

export type DispatchRouteFormProps = {
  actionValidateRoute: HandleThunkActionCreator<
    typeof routesActions.actionValidateRoute
  >;
  loadGeozones: (serverName: string, company_id?: number | null) => any;
};

export type InputRouteFormProps = {
  handleHide: (hasSubmtit: boolean, route?: any) => any;
  page: string;
  path?: string;
  element: Partial<Route> | null;
  routesMapNameId?: Map<string, number>;
  fromMission?: boolean;
  fromMissionTemplate?: boolean;
  fromOrder?: boolean;
  missionAvailableRouteTypes?: Array<string>;
  hasMissionStructureId?: boolean;

};

export type OwnRouteFormProps = InputRouteFormProps & {
};

export type PropsRouteWithForm = StateRouteFormProps &
  DispatchRouteFormProps &
  OwnRouteFormProps
  & {
    isPermittedToShowBridge: boolean;
  };

export type FormStateRouteForm = Route & {
  normatives: Array<any>;
  available_route_types: Array<string>;
  draw_object_list: Array<any>;
};

export type PropsRouteForm = OutputWithFormProps<
  PropsRouteWithForm,
  FormStateRouteForm,
  [FormStateRouteForm, boolean?],
  any
>;

export type ModifyBridgesForRoute = {
  [key: string]: GeozonesDataByIndex & {
    state: number;
  };
};

export type StateRouteForm = {
  bridges: ModifyBridgesForRoute;
  municipal_facility_list: Array<MunicipalFacility>;
};
