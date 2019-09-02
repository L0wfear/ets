import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import OdhListFormWrap from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/OdhFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/registry-config';

type Props = {};

const OdhList: React.FC<Props> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <OdhListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(OdhList);
