import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import FountainsFormWrap from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/FountainsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/registry-config';

import {
  PropsFountainsList,
  StateFountainsList,
} from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsList.h';

class FountainsList extends React.Component<PropsFountainsList, StateFountainsList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <FountainsFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(FountainsList);
