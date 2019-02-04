import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PgmStoreFormWrap from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/PgmStoreFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/registry-config';

import {
  PropsPgmStoreList,
  StatePgmStoreList,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreList.h';

class PgmStoreList extends React.Component<PropsPgmStoreList, StatePgmStoreList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <PgmStoreFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(PgmStoreList);
