import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { GeozonesDataByIndex } from 'redux-main/trash-actions/geometry/geometry.h';
import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';

export type PropsRouteFormWrap = InputRouteFormProps & {
  showForm: boolean;
};

export type StateRouteFormProps = {
  userStructureId: InitialStateSession['userData']['structure_id'],
  userStructureName: InitialStateSession['userData']['structure_name'],
};

export type DispatchRouteFormProps = {
  validateRoute: (formState: FormStateRouteForm) => Promise<any>;
  loadGeozones: (serverName: string, company_id?: number | null) => any,
};

export type InputRouteFormProps = {
  handleHide: (hasSubmtit: boolean, route?: any) => any;
  page: string;
  element: Route;
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

export type PropsRouteWithForm = (
  StateRouteFormProps
  & DispatchRouteFormProps
  & OwnRouteFormProps
);

export type FormStateRouteForm = Route & {
  normatives: any[];
  available_route_types: string[];
  draw_object_list: any[];
};

export type PropsRouteForm = OutputWithFormProps<
  PropsRouteWithForm,
  FormStateRouteForm,
  [
    FormStateRouteForm,
    boolean?
  ],
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
