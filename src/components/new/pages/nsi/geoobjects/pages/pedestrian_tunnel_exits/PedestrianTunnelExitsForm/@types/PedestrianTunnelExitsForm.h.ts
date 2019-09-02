import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsPedestrianTunnelExitsFormWrap = {
  showForm: boolean;
  element: PedestrianTunnelExits | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type OwnPropsPedestrianTunnelExitsForm = {
  element: PedestrianTunnelExits | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsPedestrianTunnelExitsFormWithForm = (
  OwnPropsPedestrianTunnelExitsForm
);

export type PropsPedestrianTunnelExitsForm = OutputWithFormProps<
  PropsPedestrianTunnelExitsFormWithForm,
  PedestrianTunnelExits,
  [ PedestrianTunnelExits ],
  any
>;
