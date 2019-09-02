import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsPedestrianTunnelsFormWrap = {
  showForm: boolean;
  element: PedestrianTunnels | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type OwnPropsPedestrianTunnelsForm = {
  element: PedestrianTunnels | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsPedestrianTunnelsFormWithForm = (
  OwnPropsPedestrianTunnelsForm
);

export type PropsPedestrianTunnelsForm = OutputWithFormProps<
  PropsPedestrianTunnelsFormWithForm,
  PedestrianTunnels,
  [ PedestrianTunnels ],
  any
>;
