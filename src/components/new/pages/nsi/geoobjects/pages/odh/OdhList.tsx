import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';
import OdhListFormWrap from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/OdhFormWrap';

import {
  registryKey,
  config,
  components,
} from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/registry-config';

import {
  PropsOdhList,
  StateOdhList,
} from 'components/new/pages/nsi/geoobjects/pages/odh/OdhList.h';

class OdhList extends React.Component<PropsOdhList, StateOdhList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
          components={components}
        />
        <OdhListFormWrap
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(OdhList);
