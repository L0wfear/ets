import * as React from 'react';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/registry-config';

import {
  PropsTypesAttrList,
  StateTypesAttrList,
} from 'components/new/pages/nsi/autobase/pages/types-attr/TypesAttrList.h';

class TypesAttrList extends React.Component<PropsTypesAttrList, StateTypesAttrList> {
  render() {
    return (
       <>
        <Registry
          registryKey={registryKey}
        />
      </>
    );
  }
}

export default withRegistry<any>(
  config,
)(TypesAttrList);
