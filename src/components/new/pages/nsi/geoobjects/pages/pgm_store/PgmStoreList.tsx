import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PgmStoreFormWrap from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/PgmStoreFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/registry-config';

type Props = {};

const PgmStoreList: React.FC<Props> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <PgmStoreFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(PgmStoreList);
