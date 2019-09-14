import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsPedestrianTunnelExitsFormWithForm = WithFormRegistrySearchAddProps<PedestrianTunnelExits>;

export type PropsPedestrianTunnelExitsForm = OutputWithFormProps<
  PropsPedestrianTunnelExitsFormWithForm,
  PedestrianTunnelExits,
  [ PedestrianTunnelExits ],
  any
>;
