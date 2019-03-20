import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import MspFormWrap from 'components/new/pages/nsi/geoobjects/pages/msp/MspForm/MspFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/registry-config';

import {
  PropsMspList,
  StateMspList,
} from 'components/new/pages/nsi/geoobjects/pages/msp/MspList.h';

class MspList extends React.Component<PropsMspList, StateMspList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <MspFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(MspList);
