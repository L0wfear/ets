import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import { HandleThunkActionCreator } from 'react-redux';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export type PropsRouteFormWrap = InputRouteFormProps & {
  showForm: boolean;
};

export type StateRouteFormProps = {
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
  missionAvailableRouteTypes?: string[];
  hasMissionStructureId?: boolean;

};

export type OwnRouteFormProps = InputRouteFormProps & {
  isPermittedToShowBridge: boolean;
};

export type PropsRouteWithForm = StateRouteFormProps &
  DispatchRouteFormProps &
  OwnRouteFormProps;

export type FormStateRouteForm = Route & {
  normatives: any[];
  available_route_types: string[];
  draw_object_list: any[];
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
};
