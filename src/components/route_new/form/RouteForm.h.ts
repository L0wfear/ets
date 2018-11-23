import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { OutputProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CreateRouteActionAns, RouteFormStateType } from 'redux-main/trash-actions/route/route';

export type PropsRouteFormWrap = OwnRouteFormProps & {
  showForm: boolean;
};

export type StateRouteFormProps = {
  userStructureId: InitialStateSession['userData']['structure_id'],
  userStructureName: InitialStateSession['userData']['structure_name'],
};

export type DispatchRouteFormProps = {
  validateRoute: (formState: FormStateRouteForm) => Promise<any>;
  createAction: (formState: FormStateRouteForm, isTemplate: boolean) => Promise<any>;
  updateAction: (formState: FormStateRouteForm) => Promise<any>;
};

export type OwnRouteFormProps = {
  handleHide: (hasSubmtit: boolean, route?: any) => any;
  page: string;
  element: RouteFormStateType;
  routesMapNameId?: Map<string, number>;
  fromMission?: boolean;
  fromOrder?: boolean;
  missionAvailableRouteTypes?: string[];
  hasMissionStructureId?: boolean;
};

export type PropsRouteWithForm = (
  StateRouteFormProps
  & DispatchRouteFormProps
  & OwnRouteFormProps
);

export type FormStateRouteForm = RouteFormStateType & {
  normatives: any[];
  available_route_types: string[];
  draw_object_list: any[];
};

export type PropsRouteForm = OutputProps<
  PropsRouteWithForm,
  FormStateRouteForm,
  [
    FormStateRouteForm,
    boolean?
  ],
  CreateRouteActionAns
>;

export type StateRouteForm = {
};
