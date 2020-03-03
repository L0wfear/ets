import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import PgmStoreFormWrap from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/PgmStoreFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/registry-config';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';

type OwnProps = {};

const PgmStoreList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <PgmStoreFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<PgmStore, OwnProps>(
  config,
)(PgmStoreList);
