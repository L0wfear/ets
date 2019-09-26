import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import OdhListFormWrap from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/OdhFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/registry-config';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';

type OwnProps = {};

const OdhList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <OdhListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<Odh, OwnProps>(
  config,
)(OdhList);
