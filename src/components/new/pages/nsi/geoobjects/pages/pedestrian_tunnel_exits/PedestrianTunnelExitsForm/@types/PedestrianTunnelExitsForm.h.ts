import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsPedestrianTunnelExitsFormWrap = {
  showForm: boolean;
  element: PedestrianTunnelExits | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsPedestrianTunnelExitsForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsPedestrianTunnelExitsForm = DispatchProp;
export type OwnPropsPedestrianTunnelExitsForm = {
  element: PedestrianTunnelExits | null;
  handleHide: OnFormHideType
  page: string;
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
