import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import SspFormWrap from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/SspFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/registry-config';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

type OwnProps = {};

const SspList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <SspFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<Ssp, OwnProps>(
  config,
)(SspList);
