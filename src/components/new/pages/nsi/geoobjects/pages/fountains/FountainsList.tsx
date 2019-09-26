import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import FountainsFormWrap from 'components/new/pages/nsi/geoobjects/pages/fountains/FountainsForm/FountainsFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/registry-config';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';

type OwnProps = {};

const FountainsList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <FountainsFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<Fountains, OwnProps>(
  config,
)(FountainsList);
