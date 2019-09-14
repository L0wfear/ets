import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsPedestrianTunnelsFormWithForm = WithFormRegistrySearchAddProps<PedestrianTunnels>;

export type PropsPedestrianTunnelsForm = OutputWithFormProps<
  PropsPedestrianTunnelsFormWithForm,
  PedestrianTunnels,
  [ PedestrianTunnels ],
  any
>;
