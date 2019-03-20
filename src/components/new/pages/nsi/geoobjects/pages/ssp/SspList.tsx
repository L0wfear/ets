import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import SspFormWrap from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/SspFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/registry-config';

import {
  PropsSspList,
  StateSspList,
} from 'components/new/pages/nsi/geoobjects/pages/ssp/SspList.h';

class SspList extends React.Component<PropsSspList, StateSspList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <SspFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(SspList);
