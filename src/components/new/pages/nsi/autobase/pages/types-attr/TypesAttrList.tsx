import * as React from 'react';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data/registry-config';

import { TypesAttr } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type OwnProps = {};

const TypesAttrList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey} />
   );
  },
);

export default withRegistry<TypesAttr, OwnProps>(
  config,
)(TypesAttrList);
