import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import SnowStorageFormWrap from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageForm/SnowStorageFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/registry-config';

import {
  PropsSnowStorageList,
  StateSnowStorageList,
} from 'components/new/pages/nsi/geoobjects/pages/snow_storage/SnowStorageList.h';

class SnowStorageList extends React.Component<PropsSnowStorageList, StateSnowStorageList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <SnowStorageFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry(
  config,
)(SnowStorageList);
