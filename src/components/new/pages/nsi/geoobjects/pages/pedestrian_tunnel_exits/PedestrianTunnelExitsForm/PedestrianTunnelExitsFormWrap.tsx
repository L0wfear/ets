import * as React from 'react';
import { withFormRegistrySearch, WithFormRegistrySearchProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';

const PedestrianTunnelExitsFrom = React.lazy(() => (
  import(/* webpackChunkName: "PedestrianTunnelExits_form" */ 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/PedestrianTunnelExitsForm/PedestrianTunnelExitsForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<PedestrianTunnelExits>, PedestrianTunnelExits>({
  add_path: 'PedestrianTunnelExits',
})(PedestrianTunnelExitsFrom);
