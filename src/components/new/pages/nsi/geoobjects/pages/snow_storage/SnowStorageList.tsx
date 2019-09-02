import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import SnowStorageFormWrap from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/SnowStorageFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/registry-config';

type Props = {};

const SnowStorageList: React.FC<Props> = React.memo(
  () => {
    return (
       <React.Fragment>
        <Registry registryKey={registryKey} />
        <SnowStorageFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<any>(
  config,
)(SnowStorageList);
