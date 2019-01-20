import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelExits, CreatePedestrianTunnelExits, UpdatePedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsPedestrianTunnelExitsFormWrap = {
  showForm: boolean;
  element: PedestrianTunnelExits | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsPedestrianTunnelExitsForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsPedestrianTunnelExitsForm = {
  createAction: CreatePedestrianTunnelExits;
  updateAction: UpdatePedestrianTunnelExits;
};
export type OwnPropsPedestrianTunnelExitsForm = {
  element: PedestrianTunnelExits | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsPedestrianTunnelExitsFormWithForm = (
  StatePropsPedestrianTunnelExitsForm
  & DispatchPropsPedestrianTunnelExitsForm
  & OwnPropsPedestrianTunnelExitsForm
);

export type PropsPedestrianTunnelExitsForm = OutputWithFormProps<
  PropsPedestrianTunnelExitsFormWithForm,
  PedestrianTunnelExits,
  [ PedestrianTunnelExits ],
  any
>;
export type StatePedestrianTunnelExitsForm = {
};
