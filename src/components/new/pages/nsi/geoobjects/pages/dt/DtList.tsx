import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import DtListFormWrap from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/DtFormWrap';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/registry-config';

import {
  PropsDtList,
  StateDtList,
} from 'components/new/pages/nsi/geoobjects/pages/dt/DtList.h';

class DtList extends React.Component<PropsDtList, StateDtList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
        <DtListFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(DtList);
