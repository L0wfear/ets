import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import DtListFormWrap from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/DtFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/registry-config';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';

type OwnProps = {};

const DtList: React.FC<OwnProps> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <DtListFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<Dt, OwnProps>(
  config,
)(DtList);
