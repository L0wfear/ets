import * as React from 'react';
import { WithFormRegistrySearchProps, withFormRegistrySearch } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { PedestrianTunnels } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnels/@types';

const PedestrianTunnelsFrom = React.lazy(() => (
  import(/* webpackChunkName: "PedestrianTunnels_form" */ 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/PedestrianTunnelsForm/PedestrianTunnelsForm')
));

export default withFormRegistrySearch<WithFormRegistrySearchProps<PedestrianTunnels>, PedestrianTunnels>({
  add_path: 'PedestrianTunnels',
})(PedestrianTunnelsFrom);
