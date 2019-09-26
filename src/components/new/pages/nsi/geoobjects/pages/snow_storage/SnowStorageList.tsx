import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import SnowStorageFormWrap from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/SnowStorageFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/registry-config';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

type OwnProps = {};

const SnowStorageList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <SnowStorageFormWrap registryKey={registryKey} />
       </React.Fragment>
    );
  },
);

export default withRegistry<SnowStorage, OwnProps>(
  config,
)(SnowStorageList);
